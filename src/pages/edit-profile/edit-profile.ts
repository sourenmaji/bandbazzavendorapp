import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, IonicPage, LoadingController, MenuController, NavController, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';

@IonicPage()
@Component({
selector: 'page-edit-profile',
templateUrl: 'edit-profile.html',
})
export class EditProfilePage implements OnInit{
userPostData = {"user":"","token":""};
userPassword = {"password":"","password_confirmation":""};
userDetails : any;
responseData: any;
user_OTP: any =null;
user_phone: any =null;
editUserDetails : any;
newU = {"token":"","user":""};
public buttonClicked: boolean = false;
public otpButton: boolean = true;
public disableButton: boolean = false;
private isDisabled: boolean=false;
public otpmessage="";

constructor(public navCtrl: NavController,
public menuCtrl: MenuController,
public authService: AuthServiceProvider,
public alertCtrl: AlertController,
public platform: Platform,
public loadingCtrl: LoadingController,
public toastCtrl: ToastController) {

const data = JSON.parse(localStorage.getItem('userData'));
this.userDetails = data.user;
if(this.userDetails.phone_no != null){
this.user_phone = this.userDetails.phone_no;
}
if(this.userDetails.phone_verify != null && this.userDetails.phone_verify == 1){
this.otpButton = !this.otpButton;
this.disableButton = true;
}
console.log(this.userDetails);

this.userPostData.user = this.userDetails;
this.userPostData.token = data.token;
console.log(this.userPostData.token);

let backAction =  platform.registerBackButtonAction(() => {
this.navCtrl.pop();
backAction();
},2)
}

editform: FormGroup;
userData = { name: "",email: "",phone_no: "",address: "",otp: ""};


ngOnInit() {
//console.log(this.user_OTP);
let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let PHONEPATTERN = /^[0-9]{10}$/;

this.editform = new FormGroup({
numb: new FormControl(this.user_OTP),
pno: new FormControl(this.user_phone),
phone_no: new FormControl('', [Validators.required, Validators.pattern(PHONEPATTERN)]),
name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
address: new FormControl('', Validators.compose([])),
otp: new FormControl('', Validators.compose([])),

// otp: new FormControl('', Validators.compose([Validators.required,Validators.minLength(6),this.equalto('numb')]))
});

// console.log(this.buttonClicked)
}
// ngOnChanges(){
//   if(!this.buttonClicked){
//     this.editform.addControl('otp',new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), this.equalto('numb')])));
//   }
// }

showVal($value) {
console.log(this.userData.phone_no);
if(this.userDetails.phone_no != null){
this.user_phone = this.userDetails.phone_no;
console.log(this.user_phone);
if(this.user_phone != this.userData.phone_no){
this.otpButton = true;
this.disableButton = false;
}else{
this.otpButton = false;
this.disableButton = true;
}
}

}

equalto(field_name): ValidatorFn {

return (control: AbstractControl): {[key: string]: any} => {
let isValid = false;
if(this.user_OTP != control.value){
console.log(isValid);
console.log(this.user_OTP);
console.log(control.value);
return { 'equalTo': {isValid} };
}
else
{
  console.log("true");
  return null;
}
};
}

sendOtp(){
let loader = this.loadingCtrl.create({
content: 'Please wait...'
});
loader.present();
this.authService.getData('send_otp?phone_no='+this.userData.phone_no,this.userPostData.token).then((result: any) => {
this.responseData = result;
if(result.status)
{
this.buttonClicked = !this.buttonClicked;
this.disableButton = !this.disableButton;
this.isDisabled = !this.isDisabled;
if(this.buttonClicked)
this.editform.get('otp').setValidators(Validators.compose([Validators.required, Validators.minLength(6), this.equalto('numb')]));
loader.dismiss();
console.log(this.responseData);
this.user_OTP = this.responseData.otp;
console.log(this.user_OTP);
const alert = this.alertCtrl.create({
subTitle: this.responseData.message,
buttons: ['OK']
})
alert.present();
}
else
{
  loader.dismiss();
  console.log(this.responseData.message);
  const alert = this.alertCtrl.create({
    subTitle: this.responseData.message,
    buttons: ['OK']
    })
    alert.present();
}
}, (err) => {
this.responseData = err;
console.log(this.responseData)
loader.dismiss();
const toast = this.toastCtrl.create({
  message: this.responseData.message,
  duration: 3000,
  position: 'top'
})
toast.present();
});
}

reSendOtp(){
let loader = this.loadingCtrl.create({
content: 'Please wait...'
});
loader.present();
this.userData.otp = "";
this.authService.getData('send_otp?phone_no='+this.userData.phone_no,this.userPostData.token).then((result: any) => {
this.responseData = result;
loader.dismiss();
if(result.status)
{
this.buttonClicked = true;
this.disableButton = true;
this.isDisabled = true;
if(this.buttonClicked)
this.editform.get('otp').setValidators(Validators.compose([Validators.required, Validators.minLength(6), this.equalto('numb')]));

console.log(this.responseData);
this.user_OTP = this.responseData.otp;
console.log(this.user_OTP);

const alert = this.alertCtrl.create({
subTitle: this.responseData.message,
buttons: ['OK']
})
alert.present();
}
else
{
  loader.dismiss();
  console.log(this.responseData.message);
  const alert = this.alertCtrl.create({
    subTitle: this.responseData.message,
    buttons: ['OK']
    })
    alert.present();
}
},
(err) => {
loader.dismiss();
this.responseData = err;
console.log(this.responseData)
const toast = this.toastCtrl.create({
  message: this.responseData.message,
  duration: 3000,
  position: 'top'
})
toast.present();
});
}

editProfile()
{
this.authService.authData(this.userData,'edit_profile',this.userPostData.token).then((result: any) => {
this.responseData = result;
if(result.status)
{
this.buttonClicked = !this.buttonClicked;
this.disableButton = !this.disableButton;
console.log(this.responseData);
this.editUserDetails = this.responseData;
this.userDetails = this.responseData.user;
this.newU.user = this.userDetails;
this.newU.token = this.userPostData.token;
localStorage.setItem('userData', JSON.stringify(this.newU));
const alert = this.alertCtrl.create({
subTitle: this.responseData.message,
buttons: ['OK']
})
alert.present();
this.navCtrl.pop();
}
else
{
  console.log(this.responseData.error);
  const toast = this.toastCtrl.create({
    message: this.responseData.message,
    duration: 5000,
    position: 'bottom'
  })
  toast.present();
}
},
(err) => {
this.responseData = err;
console.log(this.responseData);
const toast = this.toastCtrl.create({
  message: 'Oops! Something went wrong.',
  duration: 5000,
  cssClass: 'toast-danger',
  position: 'bottom'
})
toast.present();
});
}

onOpenMenu(){
this.menuCtrl.open();
}
}
