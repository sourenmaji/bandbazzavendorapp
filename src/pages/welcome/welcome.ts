import { Component } from '@angular/core';
import { NavController, Platform, ToastController, ModalController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import {Network} from '@ionic-native/network';
import { ModuleLoader } from 'ionic-angular/util/module-loader';
export enum ConnectionStatusEnum {
  Online,
  Offline
}
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  previousStatus;
  constructor(public alertCtrl: AlertController,public navCtrl: NavController, public toast: ToastController,public network: Network, public platform: Platform) {
    this.previousStatus = ConnectionStatusEnum.Online;
  }
  ionViewDidLoad() {
    this.platform.registerBackButtonAction(() => {
      this.platform.exitApp();
      console.log("backPressed 1");
    },1);
  
    //  this.platform.ready().then(() => {
    //   this.network.onDisconnect()
    //   .subscribe(() => {
    //     this.showAlert();
    //   });
    //   this.network.onConnect().subscribe(() => {
    //     const alert = this.alertCtrl.create({
    //       subTitle: 'Network Connected',
    //       buttons: ['OK']
          
    //     })
    //     alert.present();
    //   })
    // });
  }
  // private showAlert(): void {
  //   const alert = this.alertCtrl.create({
  //     subTitle: 'Network Disconnected',
  //     buttons: ['OK']
      
  //   })
  //   alert.present();
  // }
  login(){
  this.navCtrl.push(LoginPage);
  }

  register(){
    console.log("hggh");
  this.navCtrl.push(RegisterPage);
  }
}