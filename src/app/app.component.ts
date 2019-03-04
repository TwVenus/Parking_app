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

@Component({
    templateUrl: 'app.html'
})
export class AppComponent {
    settingPage = SettingPage;
    tabPage: any = HomePage;
    @ViewChild('nav') nav: NavController;

    constructor(platform: Platform, app: App, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events, private adalAuth: AdalAuthentication, public menuCtrl: MenuController) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            if (platform.is("cordova")) {
                this.adalAuth.getToken(() => {
                    this.events.publish(environment.eventCode.onLoginSuccess);
                    console.log(environment.adalToken.idToken);
                }, () => {
                    this.tabPage = UnauthorizedPage;
                });
            } else {
                environment.adalToken.idToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyIsImtpZCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyJ9.eyJhdWQiOiI5NjFiNjMzZS0yNjY4LTQwMTgtYjczOC1hNTI1ODg4NmMxZTgiLCJpc3MiOiJodHRwczovL2FkZnMubWljcm9uLmNvbS9hZGZzIiwiaWF0IjoxNTUxMjUyMDcwLCJleHAiOjE1NTEyNTU2NzAsImF1dGhfdGltZSI6MTU1MTI1MjA3MCwic3ViIjoiMDNlcytPWW5teFdPZHBtdGpvK3JUSWZ1UTUxN21VdDJKeS9qamQwTUFLaz0iLCJ1cG4iOiJ3ZW5keWh1QG1pY3Jvbi5jb20iLCJ1bmlxdWVfbmFtZSI6IldlbmR5IEh1IOiDoeiPgOW6rSAod2VuZHlodSkiLCJwd2RfZXhwIjoiMzAwNjc1OCIsInNpZCI6IlMtMS01LTIxLTIwOTIwNTYyLTIwNDAyMzIzMzYtMzE2NjE5OTYxLTQ2MzUwNTAzIn0.uShHYYYYefB3OFPRKZGoJdXddmizPWJ0iOEb2Vg_c7Bp5cRXS20ExDNDlg18-8HPJ72na2aUws0tUB3KC6dmFCFJjnufx9eL0ZO1urBxdp99vm_ZtIv7kSyUskV-dFEslmC3-3gVSiPnHVGCiQh54zMJQcIbviBUqFeA-n_M7DJzyNoRi9Js7HInacWTLashhd83wypK_ktlYuK4lUjNW8tnpg5AkrURKH0v3b4ZGD6hCrl9DiBee6gKaD2R6T6Z7MPl6uY238rrGIM2P55faKX2h5GgmI5FESSbLGZvVQP6iqn9FXlNpU-TApN2bM4nlJT2dgof-kIoBNgwELGlYg";
                this.tabPage = HomePage;
            }
        });
    }

    onLoad(page: any) {
        this.nav.setRoot(page);
        this.menuCtrl.close();
    }
}
