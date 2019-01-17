
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { AlertController, IonicPage, LoadingController, Navbar, NavController, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { NetworkProvider } from '../../providers/network-provider/network_provider';
import { DashboardPage } from '../dashboard/dashboard';
import { ErrorPage } from '../error/error';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { RegisterPage } from '../register/register';

export enum ConnectionStatusEnum {
  Online,
  Offline
}
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage implements OnInit
{
  previousStatus;
  signinform: FormGroup;
  responseData : any;
  userData = {password: "", email: ""};
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public loadingCtrl : LoadingController,
    public navCtrl: NavController,
    public toast: ToastController,
    public network: Network,
    public platform: Platform,
    public authService:AuthServiceProvider,
    public alertCtrl: AlertController,
    public networkProvider: NetworkProvider,
    public toastCtrl: ToastController)
    {
      this.previousStatus = ConnectionStatusEnum.Online;
    }
    
    ionViewDidLoad()
    {
      console.log(this.networkProvider.networkState);
      this.platform.registerBackButtonAction(() => {
        this.platform.exitApp();
        console.log("backPressed 1");
      },1);
    }
    

    ngOnInit()
    {
      let EMAILPATTERN =/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
      this.signinform = new FormGroup({
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)])
      });
    }
    
    login()
    {
      let loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present();
      console.log(JSON.stringify(this.userData))
      this.authService.postData(this.userData,'login').then((result) => {
        loader.dismiss();
        this.responseData = result;
        
        if(this.responseData.status)
        {
          console.log(this.responseData);
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          console.log("Local storage "+JSON.parse(localStorage.getItem('userData')));
          this.navCtrl.push(DashboardPage);
        }
        else
        {
          console.log(this.responseData.message);
          const alert = this.alertCtrl.create({
            subTitle: this.responseData.message,
            buttons: ['OK']
          })
          alert.present();
        }
      }, (err) =>
      {
        loader.dismiss();
        this.responseData = err;
        console.log(this.network.type);
        if(this.network.type === 'none')
        this.navCtrl.push(ErrorPage);
        console.log(this.responseData);
        const toast = this.toastCtrl.create({
          message: 'Oops! Something went wrong.',
          duration: 5000,
          cssClass: "toast-danger",
          position: 'bottom'
        })
        toast.present();
      });
    }
    
    register()
    {
      //Register page link
      this.navCtrl.push(RegisterPage);
    }
    
    forgetPassword()
    {
      this.navCtrl.push(ForgetPasswordPage);
    }
  }
  
  