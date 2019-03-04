import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AdalInterceptor } from './interceptors/adal.interceptor';

import { AdalAuthentication } from './services/adal.service';
import { DefaultService } from './services/default.service';
import { ConfigService } from './utils/config.service';
import { LoadingService } from './utils/loading.service';
import { ToastService } from './utils/toast.service';
import { PopoutService } from './utils/popout.service';
import { SettingService } from './services/settingservice';
import { ParkingLotService } from './services/parkinglotservice';

export function initConfig(config: ConfigService) {
    return () => config.load()
}

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        ConfigService,
        LoadingService,
        ToastService,
        PopoutService,
        AdalAuthentication,
        DefaultService,
        SettingService,
        ParkingLotService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AdalInterceptor,
            multi: true,
        }, {
            provide: APP_INITIALIZER,
            useFactory: initConfig,
            deps: [ConfigService],
            multi: true
        }
    ],
    declarations: []
})
export class CoreModule { }
