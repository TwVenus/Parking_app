import { Injectable } from '@angular/core';
import { Platform } from "ionic-angular";
import { environment } from "../../../environments/environment";
import { MSAdal, AuthenticationContext, AuthenticationResult, TokenCacheItem } from '@ionic-native/ms-adal';

@Injectable()
export class AdalAuthentication {
    context: AuthenticationContext;
    constructor(public platform: Platform, private MSAdal: MSAdal) {
        this.platform.ready().then(()=>{
            this.context = this.MSAdal.createAuthenticationContext(environment.adalConfig.authority, false);
        });
    }

    getAuthentication(authCompletedCallback, authErrorCallback) {
        if (!this.platform.is('cordova')) {
            console.warn("Adal not initialized");
            return;
        }

        this.context.tokenCache.readItems().then((items: TokenCacheItem) => {
            if (this.isDuplicatedCrendential(items)) {
                console.log('have multi user');
                this.context.tokenCache.clear().then(()=>{
                    this.startLogin(authCompletedCallback, authErrorCallback);
                });
            } else {
                this.startSilentLogin(authCompletedCallback, () => {
                    this.startLogin(authCompletedCallback, authErrorCallback);
                })
            }
        });
    }

    startSilentLogin(authCompletedCallback, authErrorCallback) {
        this.context.acquireTokenSilentAsync(environment.adalConfig.resource, environment.adalConfig.clientId, null)
            .then((authResult: AuthenticationResult) => {
                this.handleToken(authResult);
                authCompletedCallback();
            }, authErrorCallback);
    }

    startLogin(authCompletedCallback, authErrorCallback) {
        this.context.acquireTokenAsync(environment.adalConfig.resource, environment.adalConfig.clientId, environment.adalConfig.redirectUri, null, null)
            .then((authResult: AuthenticationResult) => {
                this.handleToken(authResult);
                authCompletedCallback();
            }, authErrorCallback);
    }

    getToken(authCompletedCallback, authErrorCallback) {
        this.getAuthentication((authResult: AuthenticationResult) => {
            authCompletedCallback();
        }, authErrorCallback);
    }

    handleToken(authResult: AuthenticationResult) {
        if (authResult != null) {
            environment.adalToken.accessToken = authResult.accessToken;
            environment.adalToken.idToken = authResult.idToken;
            if (authResult.userInfo.uniqueId.indexOf("(") > -1) {
                environment.adalToken.userName = authResult.userInfo.uniqueId.split('(')[1].split(')')[0];
            } else if (authResult.userInfo.uniqueId.indexOf("@") > -1) {
                environment.adalToken.userName = authResult.userInfo.uniqueId.split('@')[0];
            }
            environment.adalToken.expireTime = authResult.expiresOn;
        }
    }

    readTokenCache(successCallback) {
        if (this.context == null) {
            console.error('Authentication context isn\'t created yet. Create context first');
            return;
        }

        this.context.tokenCache.readItems().then((res) => {
            successCallback(res);
        }, (err) => {
            console.error("Failed to read token cache: " + JSON.stringify(err));
        });
    }

    clearTokenCache(successCallback, errorCallback) {
        if (this.context == null) {
            console.error('Authentication context isn\'t created yet. Create context first');
            return;
        }

        this.context.tokenCache.clear().then(successCallback, errorCallback);
    }

    // Make sure this device only login same user crendential
    isDuplicatedCrendential(items): boolean {
        return items.filter(item => item.userInfo).map(item => this.extractUserNamefromUniqueId(item.userInfo.uniqueId)).filter((value, index, array) => array.indexOf(value) === index) > 1;
    }

    extractUserNamefromUniqueId(uniqueId: string): string{
        if (uniqueId.indexOf("(") > -1) {
            return uniqueId.split('(')[1].split(')')[0];
        } else if (uniqueId.indexOf("@") > -1) {
            return uniqueId.split('@')[0];
        }
    }
}
