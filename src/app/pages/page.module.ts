import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { HomePage } from './home/home.page';
import { UnauthorizedPage } from './unauthorized/unauthorized.page';
import { TabsPage } from './tabs/tabs.page';
import { SettingPage } from './setting/setting.page';

@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [
        SettingPage,
        TabsPage,
        HomePage,
        UnauthorizedPage
    ],
    entryComponents: [
        SettingPage,
        TabsPage,
        HomePage,
        UnauthorizedPage
    ]
})
export class PageModule { }
