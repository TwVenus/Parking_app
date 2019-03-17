import { Component, OnInit } from '@angular/core';
import { Toggle, reorderArray, AlertController } from 'ionic-angular';
import { SettingService } from '../../core/services/settingservice';
import { Area } from '../../core/models/area.interface';

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.page.html'
})
export class SettingPage implements OnInit {
    public isModifyStatus = false;
    public areasCollection: Area[] = [];
    public distanceCollection: number = 0;
    public language: string = "";
    public repeat: string = "";

    constructor(private settingsService: SettingService, private alertController: AlertController) { }

    ngOnInit() {
        this.areasCollection = this.settingsService.getAreaList();
        this.distanceCollection = this.settingsService.getDistance();
        this.language = this.settingsService.getLanguage();
        this.repeat = this.settingsService.getRepeat();
    }

    onToggle(event: Toggle) {
        this.settingsService.setVoiceControl(event.checked);
    }

    checkAltVoice() {
        return this.settingsService.isVoiceOn();
    }

    editDistance(distance: number) {
        const editDistanceAlert = this.alertController.create({
            title: 'Distance (m)',
            subTitle: 'In this range will open vioce function, if Voice toggle is open.',
            inputs: [
                {
                    name: 'distance',
                    value: distance.toString(),
                    placeholder: '(m)'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Save',
                    handler: data => {
                        if (data.distance.trim() == '' || data.distance == null) {
                            return;
                        }
                        this.settingsService.updateDistance(parseInt(data.distance, 10));
                        this.distanceCollection = this.settingsService.getDistance();
                    }
                }
            ]
        });

        editDistanceAlert.present();
    }

    onToSelectLanguage() {
        this.settingsService.updateLanguage(this.language);
    }

    checkLanguage(lan: string) {
        return lan == this.language ? true : false;
    }

    onToSelectRepeat() {
        this.settingsService.updateRepeat(this.repeat);
    }

    checkRepeat(times: string) {
        return times == this.repeat ? true : false;
    }

    onEnterModifyMode(mode: boolean) {
        if (mode == false) {
            this.isModifyStatus = true;
        } else {
            this.isModifyStatus = false;
        }
    }

    reorderItems(indexes) {
        this.areasCollection = reorderArray(this.areasCollection, indexes);
        this.settingsService.updateAreaList(this.areasCollection);
    }

    onToCheck(event: Toggle, area: Area) {
        this.settingsService.updateAreaCheck(event.checked, area.area);
    }
}
