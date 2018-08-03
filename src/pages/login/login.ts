import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RegisterPage } from '../register/register';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { HomePage } from '../home/home';
import { WelcomePage } from '../welcome/welcome';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage  implements OnInit{
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController, public authService:AuthServiceProvider, public alertCtrl: AlertController) {
  }
  signinform: FormGroup;
  responseData : any;
  userData = {password: "", email: ""};

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
    console.log(JSON.stringify(this.userData))
    this.authService.postData(this.userData,'login').then((result) => {
     this.responseData = result;

     if(this.responseData.success)
     {
     console.log(this.responseData);
     localStorage.setItem('userData', JSON.stringify(this.responseData));
     console.log("Local storage "+JSON.parse(localStorage.getItem('userData')));
     this.navCtrl.push(DashboardPage);
     }
     else{ console.log(this.responseData.error); }
   }, (err) => {
    this.responseData = err.json();
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
