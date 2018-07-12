import { DashboardPage } from './../dashboard/dashboard';
import { Component } from '@angular/core';
import { NavController, AlertController, MenuController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WelcomePage } from '../welcome/welcome';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

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
               public alertCtrl: AlertController, private menuCtrl: MenuController) 
  {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
    console.log(this.userPostData.token);
    console.log( this.userPostData.user);
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
  this.responseData = err.json();
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

// backToWelcome(){
//   this.navCtrl.push(WelcomePage);
// }

// logout()
//   {
//     localStorage.clear();
//     setTimeout(() => this.backToWelcome(), 1000);
//   }
}
