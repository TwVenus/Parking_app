import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { Area } from "../models/area.interface";
import { Settings } from "../models/setting.interface";
import { DefaultService } from "./default.service";
import { ParkingLot } from "../models/parkinglot.interface";

@Injectable()
export class SettingService {
    private settings: Settings;

    constructor(private storage: Storage, private defaultService: DefaultService) { }

    //save settings into storage
    saveSettings() {
        this.storage.ready().then(
            () => {
                this.storage.remove('settings').then(
                    () => {
                        console.log('Success delete !');
                        this.storage.set('settings', this.settings)
                            .then(
                                () => {
                                    console.log('Success save !');
                                }
                            )
                            .catch(
                                error => {
                                    console.log('Error save : ' + error.messages)
                                }
                            );
                    }
                )
                    .catch(
                        error => {
                            console.log('Error save : ' + error.messages)
                        }
                    );
            });
    }

    // get settings from storage
    fetchSettings() {
        return this.storage.get('settings')
            .then(
                (settings: Settings) => {
                    this.settings = settings;

                    if (this.settings == null) {
                        const area_list: Area[] = [];

                        this.defaultService.getParkingLotData().subscribe(data => {
                            const parkinglot_data: ParkingLot[] = data;
                            parkinglot_data.forEach(element => {
                                area_list.push({
                                    area: element.Area,
                                    postion_lat: element.Latitude,
                                    postion_long: element.Longitude,
                                    check: true
                                });
                            });
                        });

                        this.settings = {
                            altVoiceControl: false, distance: 300, language: 'en-US', areas_List: area_list
                        };


                    }

                    console.log('Success data get!');
                    return this.settings;
                }
            )
            .catch(
                error => {
                    console.log('Error data get : ' + error.messages);
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