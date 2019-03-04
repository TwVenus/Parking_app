import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingService {

    loading: Loading;
    constructor(public _loadingCtrl: LoadingController) { }

    show() {
        this.loading = this._loadingCtrl.create({
            content: 'Please wait...'
        });
        
        this.loading.present();
    }

    showWithMessage(message: string) {
        this.loading = this._loadingCtrl.create({
            content: message
        });

        this.loading.present();
    }

    hide() {
        this.loading.dismiss();
    }

    onLoadinghide() {
        this.loading.onDidDismiss(() => {
            console.log('Dismissed loading');
        });
    }
}