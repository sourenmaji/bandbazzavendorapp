import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage implements OnInit{
  public otpButton: boolean = false;
  public buttonClicked: boolean = false;
  user_OTP: any =null;
  constructor(public alertCtrl: AlertController , public authService : AuthServiceProvider,public platform: Platform,public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }

  forgetPasswordform: FormGroup;
  responseData : any;
  userData = {"email": "","otp": ""};


  ngOnInit() {
    let EMAILPATTERN = /^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
    this.forgetPasswordform = new FormGroup({
      numb: new FormControl(this.user_OTP),
      // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      otp: new FormControl('', Validators.compose([]))
    });
  }

  showVal($value) {
    console.log(this.userData.email);
    console.log(!isNaN(+this.userData.email));
     if(!isNaN(+this.userData.email)){
    this.otpButton = true;
     }else{
      this.otpButton = false;
     }
 }

 forgetPassword(){
  let loader = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  loader.present();
  this.authService.getDataWithoutToken('password_reset?user='+this.userData.email).then((result: any) => {
    loader.dismiss();
    this.responseData = result;
    if(result.status)
    {
    console.log(this.responseData);

    const alert = this.alertCtrl.create({
     subTitle: this.responseData.message,
     buttons: ['OK']

   })
   alert.present();
   this.navCtrl.pop();
    }
    else{
      const alert = this.alertCtrl.create({
        subTitle: this.responseData.message,
        buttons: ['OK']

      })
      alert.present();
     }
  }, (err) => {
    loader.dismiss();
   this.responseData = err.json();
   console.log(this.responseData)
   const alert = this.alertCtrl.create({
     subTitle: this.responseData.message,
     buttons: ['OK']
   })
   alert.present();
  });
}

equalsto(field_name): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {

    let isValid = false;
    console.log(this.userData.otp)
    if(this.user_OTP != this.userData.otp){
      return { 'equalsTo': {isValid} };

    }
  let input = control.value;
  //console.log(this.user_OTP);
  isValid=this.user_OTP==input;
  if(!isValid)
  {
    //console.log( { 'equalTo': {isValid} });
    return { 'equalsTo': {isValid} };
  }
  else
  return null;
  };
  }


}
