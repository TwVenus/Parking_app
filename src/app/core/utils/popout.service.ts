import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class PopoutService {
    constructor(public alertCtrl: AlertController) { }

    showAlert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [{
                text: 'OK'
            }, {
                text: 'Cancel'
            }
            ]
        })
        return alert.present();
    }

    showErrorAlert(message: string) {
        return this.showAlert("An error has occurred.", message);
    }

    showAlertWithCallback(title: string, message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const confirm = this.alertCtrl.create({
                title,
                message,
                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        confirm.dismiss().then(() => resolve(false));
                    }
                }, {
                    text: 'OK',
                    handler: () => {
                        confirm.dismiss().then(() => resolve(true));
                    }
                }]
            });

            return confirm.present();
        });
    }

    showConfirm() {
        let confirm = this.alertCtrl.create({
            title: 'Confirm?',
            message: 'Please Confirm?',
            buttons: [
                {
                    text: 'Disagree',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Agree',
                    handler: () => {
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        return confirm.present();
    }
}