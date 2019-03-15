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
                environment.adalToken.idToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyIsImtpZCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyJ9.eyJhdWQiOiI5NjFiNjMzZS0yNjY4LTQwMTgtYjczOC1hNTI1ODg4NmMxZTgiLCJpc3MiOiJodHRwczovL2FkZnMubWljcm9uLmNvbS9hZGZzIiwiaWF0IjoxNTUyNTIzMDUwLCJleHAiOjE1NTI1MjY2NTAsImF1dGhfdGltZSI6MTU1MjUyMjk0Nywic3ViIjoiMDNlcytPWW5teFdPZHBtdGpvK3JUSWZ1UTUxN21VdDJKeS9qamQwTUFLaz0iLCJ1cG4iOiJ3ZW5keWh1QG1pY3Jvbi5jb20iLCJ1bmlxdWVfbmFtZSI6IldlbmR5IEh1IOiDoeiPgOW6rSAod2VuZHlodSkiLCJwd2RfZXhwIjoiMTczNTc3OCIsInNpZCI6IlMtMS01LTIxLTIwOTIwNTYyLTIwNDAyMzIzMzYtMzE2NjE5OTYxLTQ2MzUwNTAzIn0.UuPWJcNzmXx0NjYbnsSdhoBo78HDrKr_f135ldP3KKlmqejY17QWj0siHmGvX4qFtCO8495-knfClpVXogqq4fj4uf0hSO7aqPNxMBEbHR-qDEUDpcyqDCmggiMubrfnQX-G2KsTpU2Y3odmZDQ4xMeLI_H8mQFGJtqXSHliP5qnwQJOO7TjmkwNsYvYtlDVLKMuSg4PSLKRkhR7PCvslgC1A3yeY5AcgYybBhMFVw-RMZTpDrecl6Y6ebQWgaw_5ajZOMhQbEx3hAXIe3_n9TF_2WCNFcMhcJLWGc0NSFPt8pU6C3vlmW6tfCaRxp6dRpmYFcy2024YeKQ264YBgQ";
                this.tabPage = HomePage;
            }
        });
    }

    onLoad(page: any) {
        this.nav.setRoot(page);
        this.menuCtrl.close();
    }
}
