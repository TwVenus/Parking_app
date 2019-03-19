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
                environment.adalToken.idToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyIsImtpZCI6Ijc0WHZUeEdpVk5mNDVLOVo5elVoQUZlQXoycyJ9.eyJhdWQiOiI5NjFiNjMzZS0yNjY4LTQwMTgtYjczOC1hNTI1ODg4NmMxZTgiLCJpc3MiOiJodHRwczovL2FkZnMubWljcm9uLmNvbS9hZGZzIiwiaWF0IjoxNTUxOTQ5MzM2LCJleHAiOjE1NTE5NTI5MzYsImF1dGhfdGltZSI6MTU1MTk0OTMzNiwic3ViIjoiMDNlcytPWW5teFdPZHBtdGpvK3JUSWZ1UTUxN21VdDJKeS9qamQwTUFLaz0iLCJ1cG4iOiJ3ZW5keWh1QG1pY3Jvbi5jb20iLCJ1bmlxdWVfbmFtZSI6IldlbmR5IEh1IOiDoeiPgOW6rSAod2VuZHlodSkiLCJwd2RfZXhwIjoiMjMwOTQ5MiIsInNpZCI6IlMtMS01LTIxLTIwOTIwNTYyLTIwNDAyMzIzMzYtMzE2NjE5OTYxLTQ2MzUwNTAzIn0.zHSsTUmCJHJs-AtU-SQtKgWi1bW99uxdBcEKRD9QhX7I9-UFzDMLpVuB3TqVzYaVA0-EJ9P5C3hyHcLonVxi2kXNBntMm9zBydSTf1lX7x7t2bRNYYkohcp9Y1dZ--QZL2g13YP9qMbbA781ygH7lDaqAcnUFMNgvOQOJX-MoqhROG7XMGzvbujbjtOjl3egDjy-mTqNn3HMw5qEAFzwe3V4E2vPZk5kzPn6S435InUxjjHoLiXZLeEXjTciFezD6xc-A8DoYP4--UTKoYny-nt-f9Or7jRduqDTKmBubwuHBfgZyZHQCTbWpm9E4GM0VrKlJ788b8Mn5LDF7WYQaw";
                this.tabPage = HomePage;
            }
        });
    }

    onLoad(page: any) {
        this.nav.setRoot(page);
        this.menuCtrl.close();
    }
}
