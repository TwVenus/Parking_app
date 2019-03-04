import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { Area } from "../models/area.interface";
import { Settings } from "../models/setting.interface";

@Injectable()
export class SettingService {
    private settings: Settings;

    constructor(private storage: Storage) { }

    //save settings into storage
    saveSettings() {
        this.storage.set('settings', this.settings)
            .then(
                () =>{
                    console.log('Success save !');
                }
            )
            .catch(
                error => {
                    this.settings = {
                        altVoiceControl: false, distance: 300, language: 'en-US', areas_List: [
                            { area: 'A1A2', postion_lat: 24.318230, postion_long: 120.724057, check: true },
                            { area: 'P1', postion_lat: 24.321710, postion_long: 120.726621, check: true }
                        ]
                    };
                    
                    console.log('Error save : ' + error.messages)
                }
            );
    }

    // get settings from storage
    fetchSettings() {
        return this.storage.get('settings')
            .then(
                (settings: Settings) => {
                    this.settings = settings != null ? settings : {
                        altVoiceControl: false, distance: 300, language: 'en-US', areas_List: [
                            { area: 'A1A2', postion_lat: 24.318230, postion_long: 120.724057, check: true },
                            { area: 'P1', postion_lat: 24.321710, postion_long: 120.726621, check: true }
                        ]
                    }

                    console.log('Success data get!');
                    return this.settings;
                }
            )
            .catch(
                error => {
                    this.settings = {
                        altVoiceControl: false, distance: 300, language: 'en-US', areas_List: [
                            { area: 'A1A2', postion_lat: 24.318230, postion_long: 120.724057, check: true },
                            { area: 'P1', postion_lat: 24.321710, postion_long: 120.726621, check: true }
                        ]
                    };

                    console.log('Error data get : ' + error.messages);
                    return this.settings;
                }
            );
    }
    
    // voice setting
    setVoiceControl(isAlt: boolean) {      
        this.settings.altVoiceControl = isAlt;
        this.saveSettings();
    }

    isVoiceOn() {
        return this.settings.altVoiceControl;
    }

    // distance setting
    updateDistance(m: number) {
        this.settings.distance = m;
        this.saveSettings();
    }

    getDistance() {
        return this.settings.distance;
    }

    // language setting
    updateLanguage(lan: string) {
        this.settings.language = lan;
        this.saveSettings();
    }

    getLanguage() {
        return this.settings.language;
    }

    // area order setting
    updateAreaList(area_list: Area[]) {
        this.settings.areas_List = area_list;
        this.saveSettings();
    }

    // whether to tell the area information setting
    updateAreaCheck(check: boolean, area_name: string) {
        this.settings.areas_List.forEach(element => {
            if (element.area == area_name) {
                element.check = check;
            }
        });
        this.saveSettings();
    }

    getAreaList() {
        return this.settings.areas_List.slice();
    }
}