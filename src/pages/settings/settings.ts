import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, MenuController, NavController, Platform, ToastController, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  forgetpasswordform: FormGroup;
  userDetails : any;
  responseData: any;
  newU =  {"token":"","user":""};
  userPostData = {"user":"","token":""};
  userPassword = {"password":"","new_password_confirmation":"","new_password":""};

  ngOnInit() {

    this.forgetpasswordform = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30)])),
      new_password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30)])),
      new_password_confirmation: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30), this.equalto('new_password')]))
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

  constructor(public navCtrl: NavController,
              public authService:AuthServiceProvider,
              public alertCtrl: AlertController,
              private menuCtrl: MenuController,
              public platform: Platform,
              public toastCtrl: ToastController,
              public facebook: Facebook,
              public googlePlus: GooglePlus)
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
    console.log(this.responseData);
   this.userDetails = this.responseData.user;
   this.newU.user = this.userDetails;
   this.newU.token = this.userPostData.token;
   localStorage.setItem('userData', JSON.stringify(this.newU));
   const alert = this.alertCtrl.create({
    subTitle: this.responseData.message,
    buttons: ['OK']
  })
  alert.present();
  this.navCtrl.setRoot('DashboardPage');
   }
   else
   {
    const alert = this.alertCtrl.create({
      subTitle: this.responseData.message,
      buttons: ['OK']
    })
    alert.present();
  }
 }, (err) => {
  this.responseData = err;
  console.log(this.responseData)
  const toast = this.toastCtrl.create({
    message: 'Oops! Something went wrong.',
    cssClass: 'toast-danger',
    position: 'bottom'
  })
  toast.present();
 });
}
onOpenMenu(){
this.menuCtrl.open();
}

onLogout()
{
  this.facebook.logout()
		.then(res =>{
      //user logged out so we will remove him from the NativeStorage
    
		}, error =>{
			console.log(error);
    });

    this.googlePlus.logout()
	  .then(res =>{
      // alert('logout from google');
		//user logged out so we will remove him from the NativeStorage
	}, err =>{
		console.log(err);
	})
    
  localStorage.clear();
  setTimeout(() => this.navCtrl.setRoot('WelcomePage'), 1000);
}
}
