import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, MenuController, NavController, Platform } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WelcomePage } from '../welcome/welcome';
import { DashboardPage } from './../dashboard/dashboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  forgetpasswordform: FormGroup;
  userDetails : any;
  responseData: any;
  newU = {"success": {"token":"","user":""}};
  userPostData = {"user":"","token":""};
  userPassword = {"password":"","new_password_confirmation":"","new_password":""};

  ngOnInit() {

    this.forgetpasswordform = new FormGroup({
      // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])),
      new_password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])),
      new_password_confirmation: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), this.equalto('new_password')]))
    });


  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

    let input = control.value;

    let isValid=control.root.value[field_name]==input
    if(!isValid)
    return { 'equalTo': {isValid} }
    else
    return null;
    };
    }

  constructor(public navCtrl: NavController, public authService:AuthServiceProvider,
               public alertCtrl: AlertController, private menuCtrl: MenuController, public platform: Platform)
  {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.token;
    console.log(this.userPostData.token);
    console.log( this.userPostData.user);
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }

change_password(){
  this.authService.authData(this.userPassword,'change_password',this.userPostData.token).then((result) => {
   this.responseData = result;
   if(this.responseData.status)
   {
  // console.log(this.responseData);
   this.userDetails = this.responseData.success.user;
   this.newU.success.user = this.userDetails;
   this.newU.success.token = this.userPostData.token;
   localStorage.setItem('userData', JSON.stringify(this.newU));
   //console.log("Local storage "+JSON.parse(localStorage.getItem('userData')));
   const alert = this.alertCtrl.create({
    subTitle: this.responseData.success.message,
    buttons: ['OK']
  })
  alert.present();
  this.navCtrl.push(DashboardPage);
   }
   else{
    const alert = this.alertCtrl.create({
      subTitle: this.responseData.success.message,
      buttons: ['OK']
    })
    alert.present();
  }
 }, (err) => {
  this.responseData = err;
  console.log(this.responseData)
  const alert = this.alertCtrl.create({
    subTitle: this.responseData.error,
    buttons: ['OK']
  })
  alert.present();
 });
}
onOpenMenu(){
this.menuCtrl.open();
}

onLogout()
{
  localStorage.clear();
  setTimeout(() => this.navCtrl.setRoot(WelcomePage), 1000);
}
}
