import { Component, ViewChild } from '@angular/core';
import { App, Platform, Events, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AdalAuthentication } from './core/services/adal.service';
//import { TabsPage } from './pages/tabs/tabs.page';
import { HomePage } from './pages/home/home.page';
import { UnauthorizedPage } from './pages/unauthorized/unauthorized.page';
import { environment } from '../environments/environment';
import { SettingPage } from './pages/setting/setting.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
    templateUrl: 'app.html'
})
export class AppComponent {
    settingPage = SettingPage;
    tabPage: any = HomePage;
    @ViewChild('nav') nav: NavController;

    constructor(platform: Platform, app: App, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events, private adalAuth: AdalAuthentication, public menuCtrl: MenuController, public geolocation: Geolocation) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            if (platform.is("cordova")) {
                this.adalAuth.getToken(() => {
                    this.events.publish(environment.eventCode.onLoginSuccess);

                    // open geolocation request
                    const options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };
                    navigator.geolocation.getCurrentPosition(success, error, options);

                    function success(position) {
                        console.log(position.coords.latitude, position.coords.longitude)
                    }

                    function error(err) {
                        console.warn(`ERROR(${err.code}): ${err.message}`);
                    }
                }, () => {
                    this.tabPage = UnauthorizedPage;
                });
            } else {
                environment.adalToken.idToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyIsImtpZCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyJ9.eyJhdWQiOiI5NjFiNjMzZS0yNjY4LTQwMTgtYjczOC1hNTI1ODg4NmMxZTgiLCJpc3MiOiJodHRwczovL2FkZnMubWljcm9uLmNvbS9hZGZzIiwiaWF0IjoxNTUzMDc5NzQyLCJleHAiOjE1NTMwODMzNDIsImF1dGhfdGltZSI6MTU1MzA1MjAwNCwic3ViIjoiMDNlcytPWW5teFdPZHBtdGpvK3JUSWZ1UTUxN21VdDJKeS9qamQwTUFLaz0iLCJ1cG4iOiJ3ZW5keWh1QG1pY3Jvbi5jb20iLCJ1bmlxdWVfbmFtZSI6IldlbmR5IEh1IOiDoeiPgOW6rSAod2VuZHlodSkiLCJwd2RfZXhwIjoiMTE3OTA4NiIsInNpZCI6IlMtMS01LTIxLTIwOTIwNTYyLTIwNDAyMzIzMzYtMzE2NjE5OTYxLTQ2MzUwNTAzIn0.M6mhUl_3Mo3XAD_9jrsqHgxQIkF5YYxJdolC_z-sf9SYmNpTzhy4AEBumA-M_JKQtpX255U2yS4ZEracKBjbYyGiyNdOoHicjRfZ-mEft5pyrmixOIhzN4u3ws4t_SjBaYa2-V4nP5TbEb3tQVc6lsbZ8Mi_xgdS72SqXhMwxY1Ex-BtPdf8lhxAxDXqDYe6bi939xfI69isDjS7mztnivP-56LqsWGHw7kMRf2LHb21DZzr-Jlwxatg_ykfkSrZ8OF7ftMiipDKIHtAY_iFDmml7sBF_qs_DkiCLejGNe8-nRPFZUkr5i6WjKcodYaDAqjPMzOKqo85fvKyuPnYkw";
                this.tabPage = HomePage;
            }
        });
    }

    onLoad(page: any) {
        this.nav.setRoot(page);
        this.menuCtrl.close();
    }
}
