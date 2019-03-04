import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {

    toast: Toast;
    constructor(public toastCtrl: ToastController) { }

    createToastWithCallback(message, callback) {    
        this.createToast(message, 'toast-message', true);
        this.toast.onDidDismiss(callback);
        this.toast.present();
    }

    createErrorToastWithCallback(message, callback) {    
        this.createToast(message, 'toast-error-message', true);
        this.toast.onDidDismiss(callback);
        this.toast.present();
    }
    
    createToast(message, style, ok, position = 'top', duration = 10000) {
        if (this.toast) {
            this.toast.dismiss();
        }

        this.toast = this.toastCtrl.create({
            message: message,
            duration: ok ? null : duration,
            position: position,
            showCloseButton: ok,
            closeButtonText: 'OK',
            cssClass: style
        });
    }

    infoToast(message, ok = false, position = 'top', duration = 10000) {
        this.createToast(message, 'toast-message', ok, position, duration);
        this.toast.present();
    }

    errorToast(message, ok = false, position = 'top', duration = 10000) {
        this.createToast(message, 'toast-error-message', ok, position, duration);
        this.toast.present();
    }

    successToast(message, ok = false, position = 'top', duration = 10000) {
        this.createToast(message, 'toast-success-message', ok, position, duration);
        this.toast.present();
    }
}