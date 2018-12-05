
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar, Platform, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Network } from '@ionic-native/network';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { ModuleLoader } from 'ionic-angular/util/module-loader';
import { NetworkProvider } from '../../providers/network-provider/network_provider';
import { ErrorPage } from '../error/error';

export enum ConnectionStatusEnum {
  Online,
  Offline
}
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage implements OnInit{
  previousStatus;
  signinform: FormGroup;
  responseData : any;
  userData = {password: "", email: ""};
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public loadingCtrl : LoadingController , public navCtrl: NavController, public toast: ToastController,public network: Network, public platform: Platform,public authService:AuthServiceProvider, public alertCtrl: AlertController
             ,public networkProvider: NetworkProvider) {
  this.previousStatus = ConnectionStatusEnum.Online;
  }
  ionViewDidLoad() {
    console.log(this.networkProvider.networkState);
    this.platform.registerBackButtonAction(() => {
      this.platform.exitApp();
      console.log("backPressed 1");
    },1);
  }

  ionViewDidEnter(){
    }

    ngOnInit() {
      let EMAILPATTERN =/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
      this.signinform = new FormGroup({
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)])

      });
    }

    login(){
      let loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present();
      console.log(JSON.stringify(this.userData))
      this.authService.postData(this.userData,'login').then((result) => {
       this.responseData = result;

       if(this.responseData.success)
       {
        loader.dismiss();
       console.log(this.responseData);
       localStorage.setItem('userData', JSON.stringify(this.responseData));
       console.log("Local storage "+JSON.parse(localStorage.getItem('userData')));
       this.navCtrl.push(DashboardPage);
       }
       else{
        loader.dismiss();
          console.log(this.responseData.error);
          const alert = this.alertCtrl.create({
            subTitle: this.responseData.error,
            buttons: ['OK']
          })
          alert.present();
        }
     }, (err) => {
      loader.dismiss();
      this.responseData = err;
      console.log(this.network.type);
      if(this.network.type === 'none')
        this.navCtrl.push(ErrorPage);
      console.log(this.responseData)
      const alert = this.alertCtrl.create({
        subTitle: "Oops! Something went wrong. Please try again.",
        buttons: ['OK']
      })
      alert.present();
     });

   }

   register(){
    //Register page link
    this.navCtrl.push(RegisterPage);
  }

  forgetPassword(){
    this.navCtrl.push(ForgetPasswordPage);
  }

}
