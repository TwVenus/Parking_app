import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../../core/services/default.service';
import { ParkingLot } from '../../core/models/parkinglot.interface';
import { ParkingLotService } from '../../core/services/parkinglotservice';
import { SettingService } from '../../core/services/settingservice';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Area } from '../../core/models/area.interface';
import { Settings } from './../../core/models/setting.interface';

@Component({
    selector: 'page-home',
    templateUrl: 'home.page.html'
})

export class HomePage implements OnInit {
    public settings: Settings;
    public parkingLotsCollection: ParkingLot[] = [];
   
    public gps_distance: number[] = [];
    public speakText: string[] = [];
    
    constructor(
        private defaultService: DefaultService,
        private parkigLotService: ParkingLotService,
        private settingService: SettingService,
        private tts: TextToSpeech,
        public geolocation: Geolocation
    ) { }

    ngOnInit() {
        // Init setting
        this.getSettingsFromStorage();
       
        // Init parking lot space data
        this.getAPIData();
    }

    ionViewDidEnter() {        
        // detection gps to push information. (every 30 min)
        setInterval(() => {         
            this.pushInformation();
        }, 10000);

        setInterval(() => {
            if (this.speakText[0] != undefined && this.settings.altVoiceControl == true)
                this.speakInformation(this.speakText[0]);
        }, 30000);
    }

    private getSettingsFromStorage(){
        this.settingService.fetchSettings().then(
            (settings: Settings) => {
                this.settings = settings;
            }
        );
    }

    private getAPIData(){
        this.defaultService.getParkingLotData().subscribe(data => {
            data.forEach(element => {
                this.parkigLotService.addParkingLotToList(element);
            });
            this.getParkingLotsData();
        });
    }

    // Cards content
    private getParkingLotsData() {
        this.parkingLotsCollection = [];
        const areas_order: Area[] = this.settings.areas_List; // get area order
        const parkinglots: ParkingLot[] = this.parkigLotService.getParkingLotList(); // get parkinglot data

        // change order
        areas_order.forEach(element_area_name => {
            parkinglots.forEach(element_parkinglot => {
                if (element_area_name.area.trim() == element_parkinglot.Area.trim()) {
                    this.parkingLotsCollection.push(element_parkinglot);
                }
            });
        });
    }

    private pushInformation() {
        this.getAPIData();
        
        const areas_order = this.settings.areas_List;
        const distance_setting = this.settings.distance;
        const voice_no = this.settings.altVoiceControl;
        const language = this.settings.language;
        const parkinglot_space = this.parkigLotService.getParkingLotList();

        var _gps_distance: number[] = [];
        var _speak_text: string[] = [];

        const options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };
        navigator.geolocation.getCurrentPosition(success, error, options);

        function success(position) {
            var distance = getDistance(position.coords.latitude, position.coords.longitude, areas_order[0].postion_lat, areas_order[0].postion_long);
            console.log(distance);

            if (distance < distance_setting && voice_no == true) {
                var text = "";
                areas_order.forEach(area_element => {
                    parkinglot_space.forEach(parkinglotspace_element => {
                        if (parkinglotspace_element.Area.trim() == area_element.area.trim() && area_element.check == true) {
                            if (language == 'en-US')
                                text += parkinglotspace_element.Area.trim() + " has " + parkinglotspace_element.CurrentQuantity.toString() + " spaces. ";
                            else if (language == 'zh-CN')
                                text += parkinglotspace_element.Area.trim() + " 剩餘 " + parkinglotspace_element.CurrentQuantity.toString() + " 個空位。 ";                        
                        }
                        
                        _gps_distance.push(getDistance(position.coords.latitude, position.coords.longitude, area_element.postion_lat, area_element.postion_long));
                    });
                });
                _speak_text.push(text);
            }
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        function getDistance(longitude1: number, latitude1: number, longitude2: number, latitude2: number) {
            const lat1: number = latitude1 * Math.PI / 180.00;
            const lat2: number = latitude2 * Math.PI / 180.00;
            const lon1: number = longitude1 * Math.PI / 180.00;
            const lon2: number = longitude2 * Math.PI / 180.00;
            const R = 6371.0;
            const dis: number = (Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R) * 1000;

            return Math.round(dis);
        }

        this.gps_distance = _gps_distance;
        this.speakText = _speak_text;
    }

    // Voice 
    async speakInformation(tts_text: string){
        try {
            console.log(tts_text);

            this.tts.speak({
                text: tts_text,
                locale: this.settings.language,
                rate: 1.5
            }).then(() => console.log('Success')).catch((reason: any) => console.log(reason));
        } catch (error) {
            console.log(error);
        }        
    }
}
