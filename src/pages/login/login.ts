import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, LoadingController, Navbar, NavController, Platform } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DashboardPage } from '../dashboard/dashboard';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { RegisterPage } from '../register/register';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  signinform: FormGroup;
  responseData : any;
  userData = {password: "", email: ""};
  pushtoken : string;

  @ViewChild(Navbar) navBar: Navbar;
  constructor(public platform: Platform,
              public navCtrl: NavController,
              public authService:AuthServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController)
              {
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2);

    let EMAILPATTERN =/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
    this.signinform = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)])
    });
  }

  ionViewDidEnter(){
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.navCtrl.setRoot(WelcomePage);
     }
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
   },
   (err) =>
   {
    loader.dismiss();
    this.responseData = err;
    console.log(this.responseData)
    const alert = this.alertCtrl.create({
      subTitle: this.responseData.message,
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
