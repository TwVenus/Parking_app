import { Component, ViewChild } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { HomePage } from '../home/home.page';
import { SettingPage } from '../setting/setting.page';

@Component({
    templateUrl: 'tabs.page.html'
})
export class TabsPage {
    @ViewChild('tabs') tabRef: Tabs;
    tab1Home = HomePage;
    tab2Setting = SettingPage;

    constructor() {

    }
}
