﻿
// Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.

/*global require, Microsoft, Windows, WinJS*/

var Deferred = require('./utility').Utility.Deferred;
var UserInfo = require('./UserInfo');

var isPhone = WinJS.Utilities.isPhone;

var webAuthBrokerContinuationCallback = null;
var successWebAuthStatus = Windows.Security.Authentication.Web.WebAuthenticationStatus.success;
var activationKindWebAuthContinuation = Windows.ApplicationModel.Activation.ActivationKind.webAuthenticationBrokerContinuation;
var AUTH_RESULT_SUCCESS_STATUS = 0;
var OPTIONAL_DISPLAYABLE_ID = Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType.optionalDisplayableId;

var ctxCache = {};

function handleAuthResult(win, fail, res) {
    if (res.status === AUTH_RESULT_SUCCESS_STATUS) {
        win(res);
    } else {
        fail(res);
    }
}

function tryMapUniqueIdToDisplayName(context, uniqueId) {
    var cacheItems = toJsArray(context.tokenCache.readItems() || []);

    for (var i = 0; i < cacheItems.length; i++) {
        try {
            if (cacheItems[i].uniqueId === uniqueId) {
                return cacheItems[i].displayableId;
            }
        } catch (e) { }
    }

    return null;
}

function tryMapDisplayNameToUniqueId(context, displayName) {
    var cacheItems = toJsArray(context.tokenCache.readItems() || []);

    for (var i = 0; i < cacheItems.length; i++) {
        try {
            if (cacheItems[i].displayableId === displayName) {
                return cacheItems[i].uniqueId;
            }
        } catch (e) { }
    }

    return null;
}

function getUserIdentifier(context, userId) {
    var uniqueId = tryMapDisplayNameToUniqueId(context, userId);
    if (uniqueId !== null) {
        return wrapUserId(userId, OPTIONAL_DISPLAYABLE_ID);
    } 

    var displayName = tryMapUniqueIdToDisplayName(context, userId);
    if (displayName !== null) {
       return wrapUserId(displayName, OPTIONAL_DISPLAYABLE_ID);
    }

    return wrapUserId(userId, OPTIONAL_DISPLAYABLE_ID);
}

function wrapUserId(userId, type) {
    return (userId !== '' && userId != null) ? new Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier(userId, type)
        : Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier.anyUser;
}

function toJsArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
}

var ADALProxy = {
    createAsync: function (win, fail, args) {
        var authority = args[0];
        var validateAuthority = args[1] !== false; // true by default

        if (isPhone) {
            try {
                // WP 8.1
                Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext.createAsync(authority, validateAuthority).then(function (ctx) {
                    ctx.useCorporateNetwork = window.ADAL_DEFAULT_USE_CORPORATE_NETWORK === true;
                    ctxCache[authority] = ctx;
                    win(ctx);
                }, function(e) {
                    fail(e);
                });
            } catch (e) {
                fail(e);
            }
        } else {
            // Win 8.0 / 8.1
            try {
                var nativeContext = new Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext(authority, validateAuthority);
                nativeContext.useCorporateNetwork = window.ADAL_DEFAULT_USE_CORPORATE_NETWORK === true;
                ctxCache[authority] = nativeContext;
                win(nativeContext);
            } catch (e) {
                fail(e);
            }
        }
    },

    getOrCreateCtx: function(authority, validateAuthority) {
        var d = new Deferred();
        validateAuthority = validateAuthority !== false; // true by default

        if (typeof ctxCache[authority] !== 'undefined') {
            d.resolve(ctxCache[authority]);
        } else {
            ADALProxy.createAsync(function (ctx) {
                d.resolve(ctx);
            }, function (err) {
                d.reject(err);
            }, [authority, validateAuthority]);
        }

        return d;
    },

    acquireTokenAsync: function (win, fail, args) {
        try {
            var authority = args[0];
            var validateAuthority = args[1];
            var resourceUrl = args[2];
            var clientId = args[3];
            var redirectUrl = new Windows.Foundation.Uri(args[4]);
            var userId = args[5];
            var extraQueryParameters = args[6];
            var userIdentifier;

            ADALProxy.getOrCreateCtx(authority, validateAuthority).then(function (context) {
                userIdentifier = getUserIdentifier(context, userId);

                if (isPhone) {
                    // Continuation callback is used when we're running on WindowsPhone which uses
                    // AuthenticateAndContinue method instead of AuthenticateAsync, which uses different async model
                    // Continuation callback need to be assigned to Application's 'activated' event.
                    webAuthBrokerContinuationCallback = function (activationArgs) {
                        if (activationArgs.detail.kind === activationKindWebAuthContinuation) {
                            var result = activationArgs.detail.webAuthenticationResult;
                            if (result.responseStatus == successWebAuthStatus) {
                                context.continueAcquireTokenAsync(activationArgs.detail);
                            } else {
                                fail(result);
                            }
                            WinJS.Application.removeEventListener('activated', webAuthBrokerContinuationCallback, true);
                        }
                    };

                    WinJS.Application.addEventListener('activated', webAuthBrokerContinuationCallback, true);

                    try {
                        if (typeof userIdentifier !== 'undefined') {
                            if (typeof extraQueryParameters === 'undefined') {
                                context.acquireTokenAndContinue(resourceUrl, clientId, redirectUrl, userIdentifier, function (res) {
                                    handleAuthResult(win, fail, res);
                                });
                            } else {
                                context.acquireTokenAndContinue(resourceUrl, clientId, redirectUrl, userIdentifier, extraQueryParameters, function (res) {
                                    handleAuthResult(win, fail, res);
                                });
                            }
                        } else {
                            context.acquireTokenAndContinue(resourceUrl, clientId, redirectUrl, function (res) {
                                handleAuthResult(win, fail, res);
                            });
                        }
                    } catch (e) {
                        fail(e);
                    }
                } else {
                    if (context.useCorporateNetwork) {
                        // Try to SSO first
                        context.acquireTokenAsync(resourceUrl, clientId, Windows.Security.Authentication.Web.WebAuthenticationBroker.getCurrentApplicationCallbackUri(), Microsoft.IdentityModel.Clients.ActiveDirectory.PromptBehavior.never, userIdentifier, extraQueryParameters).then(function (res) {
                            handleAuthResult(win, function() {
                                context.acquireTokenAsync(resourceUrl, clientId, Windows.Security.Authentication.Web.WebAuthenticationBroker.getCurrentApplicationCallbackUri(), Microsoft.IdentityModel.Clients.ActiveDirectory.PromptBehavior.always, userIdentifier, extraQueryParameters).then(function (res) {
                                    handleAuthResult(win, fail, res);
                                }, fail);
                            }, res);
                        }, fail);
                    } else {
                        context.acquireTokenAsync(resourceUrl, clientId, redirectUrl, Microsoft.IdentityModel.Clients.ActiveDirectory.PromptBehavior.always, userIdentifier, extraQueryParameters).then(function (res) {
                            handleAuthResult(win, fail, res);
                        }, fail);
                    }
                }
            }, fail);
        } catch (e) {
            fail(e);
        }
    },

    acquireTokenSilentAsync: function (win, fail, args) {
        try {
            var authority = args[0];
            var validateAuthority = args[1];
            var resourceUrl = args[2];
            var clientId = args[3];
            var userId = args[4];

            ADALProxy.getOrCreateCtx(authority, validateAuthority).then(function (context) {
                var userIdentifier = getUserIdentifier(context, userId);
                context.acquireTokenSilentAsync(resourceUrl, clientId, userIdentifier).then(function (res) {
                    handleAuthResult(win, fail, res);
                }, fail);
            }, fail);
        } catch (e) {
            fail(e);
        }
    },

    tokenCacheClear: function (win, fail, args) {
        try {
            var authority = args[0];
            var validateAuthority = args[1];

            ADALProxy.getOrCreateCtx(authority, validateAuthority).then(function (context) {
                context.tokenCache.clear();
                ctxCache = {};
                win();
            }, fail);
        } catch (e) {
            fail(e);
        }
    },

    tokenCacheReadItems: function (win, fail, args) {
        try {
            var authority = args[0];
            var validateAuthority = args[1];

            ADALProxy.getOrCreateCtx(authority, validateAuthority).then(function (context) {
                win(toJsArray(context.tokenCache.readItems() || []).map(function (item) {
                    var copy = {};

                    try {
                        copy.accessToken = item.accessToken;
                    } catch (e) { }

                    try {
                        copy.authority = item.authority;
                    } catch (e) { }

                    try {
                        copy.clientId = item.clientId;
                    } catch (e) { }

                    try {
                        copy.displayableId = item.displayableId;
                    } catch (e) { }

                    try {
                        copy.expiresOn = item.expiresOn;
                    } catch (e) { }

                    try {
                        copy.isMultipleResourceRefreshToken = item.isMultipleResourceRefreshToken;
                    } catch (e) { }

                    try {
                        copy.resource = item.resource;
                    } catch (e) { }

                    try {
                        copy.tenantId = item.tenantId;
                    } catch (e) { }


                    try {
                        copy.idToken = item.idToken;
                        copy.userInfo = UserInfo.fromJWT(copy.idToken || copy.accessToken);
                    } catch (e) { }

                    return copy;
                }));
            }, fail);
        } catch (e) {
            fail(e);
        }
    },

    tokenCacheDeleteItem: function (win, fail, args) {
        try {
            var contextAuthority = args[0];
            var validateAuthority = args[1];
            var itemAuthority = args[2];
            var itemResource = args[3];
            var itemClientId = args[4];
            var itemUserId = args[5];
            var itemIsMultipleResourceRefreshToken = args[6];

            ADALProxy.getOrCreateCtx(contextAuthority, validateAuthority).then(function (context) {
                var allItems = toJsArray(context.tokenCache.readItems() || []);

                for (var i = 0; i < allItems.length; i++) {
                    if (allItems[i].clientId === itemClientId
                        && allItems[i].resource === itemResource
                        && allItems[i].uniqueId === itemUserId
                        && allItems[i].authority === itemAuthority
                        && allItems[i].isMultipleResourceRefreshToken === itemIsMultipleResourceRefreshToken) {
                        context.tokenCache.deleteItem(allItems[i]);
                        win();
                        return;
                    }
                }

                fail('No such item found');
            }, fail);
        } catch (e) {
            fail(e);
        }
    }
};

require("cordova/exec/proxy").add("ADALProxy", ADALProxy);
