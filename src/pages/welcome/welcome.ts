import { Component } from '@angular/core';
import { NavController , Platform, ToastController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import {Network} from '@ionic-native/network';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  constructor(public navCtrl: NavController, public toast: ToastController,public network: Network, public platform: Platform) {}
  ionViewDidLoad() {
     this.platform.ready().then(() => {
      let connectSubscription = this.network.onConnect().subscribe(() =>{
      console.log('network was connected :-(');
       this.toast.create({
        message: 'Network connected',
       duration: 3000
      }).present();
});
connectSubscription.unsubscribe();
let disconnectSubscription  = this.network.onDisconnect().subscribe(() =>{
      console.log('network was disconnected :-(');
      this.toast.create({
        message: 'Network Disconnected',
        duration: 3000
      }).present();
     });
     disconnectSubscription.unsubscribe();
    });
  }
  
  login(){
  this.navCtrl.push(LoginPage);
  }

  register(){
    console.log("hggh");
  this.navCtrl.push(RegisterPage);
  }
}