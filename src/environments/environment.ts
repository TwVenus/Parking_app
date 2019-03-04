export const environment = {
    about: {
        appName: "Template",
        supportContact: "Please contact the Service Desk<br/>or Mobile Team",
        clarimTag: "Micron Technology, Inc.<br />&copy;All rights reserved."
    },
    eventCode: {
        onLoginSuccess: '__onLoginSuccess__'
    },
    apiConfig: {
        api_protocal: 'http',
        api_name: 'MUIWEB',
        api_version: 'api',
        getParkingLotData: 'values',
    },
    adalConfig: {
        authority: 'https://adfs.micron.com/adfs',
        clientId: '961b633e-2668-4018-b738-a5258886c1e8',
        resource: '961b633e-2668-4018-b738-a5258886c1e8',
        redirectUri: 'http://localhost:8100'
    },
    adalToken: {
        idToken: '',
        accessToken: '',
        userName: '',
        expireTime: new Date()
    }
};