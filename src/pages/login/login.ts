import { Component, OnInit, ViewChild } from '@angular/core';
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
export class LoginPage  implements OnInit{
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public platform: Platform,public navCtrl: NavController, public authService:AuthServiceProvider, public alertCtrl: AlertController,
                   public loadingCtrl: LoadingController) {
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }
  signinform: FormGroup;
  responseData : any;
  userData = {password: "", email: ""};
  pushtoken : string;

  ionViewDidEnter(){
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.navCtrl.setRoot(WelcomePage);
     }
}
  ngOnInit() {
    let EMAILPATTERN =/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
    this.signinform = new FormGroup({
      // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
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
    console.log(this.responseData)
    const alert = this.alertCtrl.create({
      subTitle: this.responseData,
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
signin(){
  this.navCtrl.push(DashboardPage);
}
}
