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
                environment.adalToken.idToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyIsImtpZCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyJ9.eyJhdWQiOiI5NjFiNjMzZS0yNjY4LTQwMTgtYjczOC1hNTI1ODg4NmMxZTgiLCJpc3MiOiJodHRwczovL2FkZnMubWljcm9uLmNvbS9hZGZzIiwiaWF0IjoxNTUyODM2NjAxLCJleHAiOjE1NTI4NDAyMDEsImF1dGhfdGltZSI6MTU1MjgzNjYwMSwic3ViIjoiMDNlcytPWW5teFdPZHBtdGpvK3JUSWZ1UTUxN21VdDJKeS9qamQwTUFLaz0iLCJ1cG4iOiJ3ZW5keWh1QG1pY3Jvbi5jb20iLCJ1bmlxdWVfbmFtZSI6IldlbmR5IEh1IOiDoeiPgOW6rSAod2VuZHlodSkiLCJwd2RfZXhwIjoiMTQyMjIyNyIsInNpZCI6IlMtMS01LTIxLTIwOTIwNTYyLTIwNDAyMzIzMzYtMzE2NjE5OTYxLTQ2MzUwNTAzIn0.xkahyQnB1tbaWGl5A-qtpP0zE1HbNFawU65AdpPHGqKwrGGuVhK4zdO5pwPvNAPWpUHiNksx2hHg00f0cwhFv7uzRq4BbD2Sk8KgjQJglikv1oTjOW0ct2du5VosZ4zDKRDxSKlYcZCivUB61rBszbAzQ2yXz5obeWxh3h6iaMR4sSK5EAHETN7lpV0QC9cJE_9XWW-5YcgtSYwi2gb4z2A8swsJYpekIIk1tYij0QZHwzsxMy5jU-AEKvZqB8iI5MxaNQ9g-IJZ75Eaj7XUX4Fom58quPgPnc8IZWHbXeq0W_RFoIfCI5XnweV3CGNrVOv64NJmTlmFY3Mvr4eOZQ";
                this.tabPage = HomePage;
            }
        });
    }

    onLoad(page: any) {
        this.nav.setRoot(page);
        this.menuCtrl.close();
    }
}
