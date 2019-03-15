import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MSAdal } from '@ionic-native/ms-adal';
// import { BackgroundMode } from '@ionic-native/background-mode';
// import { BackgroundFetch } from '@ionic-native/background-fetch';
// import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { IonicStorageModule } from '@ionic/storage';
// import { Insomnia } from '@ionic-native/insomnia';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PageModule } from './pages/page.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        PageModule,
        CoreModule,
        IonicModule.forRoot(AppComponent, { mode: 'ios' }),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        AppComponent
    ],
    providers: [
        // BackgroundGeolocation,
        Geolocation,
        TextToSpeech,
        // BackgroundMode,
        // BackgroundFetch,
        // Insomnia,
        StatusBar,
        SplashScreen,
        MSAdal,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        }
    ]
})
export class AppModule { }
