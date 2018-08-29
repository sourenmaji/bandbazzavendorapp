
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar, Platform, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit{

  @ViewChild(Navbar) navBar: Navbar;
   constructor(public loadingCtrl: LoadingController, public platform: Platform,public navCtrl: NavController, public authService:AuthServiceProvider, public alertCtrl: AlertController) {
  
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }

  ionViewDidLoad(){
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.navCtrl.setRoot(WelcomePage);
     }
    }
  responseData : any;
  public buttonClicked: boolean = false;
  public otpButton: boolean = false;
  user_OTP: any =null;
  signupform: FormGroup;
  userData = { name: "",user: "",password: "",password_confirmation: "",otp: ""};


  ngOnInit() {
    //let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let EMAILPATTERN =/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
    this.signupform = new FormGroup({
      numb: new FormControl(this.user_OTP),
      // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])),
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
      user: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      otp: new FormControl('', Validators.compose([])),
      password_confirmation: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), this.equalto('password')]))
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

    equalsto(field_name): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {
        // if(!this.buttonClicked)
        // {
        //     console.log( { 'equalTo': false });
        //     return { 'equalTo': false };
        // }
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
    
    showVal($value) {
      console.log(this.userData.user); 
      console.log(!isNaN(+this.userData.user));
       if(!isNaN(+this.userData.user)){
      this.otpButton = true;
       }else{
        this.otpButton = false;
       }
   }
 
   sendOtp(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.authService.getDataWithoutToken('send_otp?phone_no='+this.userData.user).then((result: any) => {
      this.responseData = result;
      if(result.status)
      {
        loader.dismiss();
        this.buttonClicked = !this.buttonClicked;
        //this.disableButton = !this.disableButton;
        if(this.buttonClicked)
        this.signupform.get('otp').setValidators(Validators.compose([Validators.required, Validators.minLength(6), this.equalsto('numb')]));
        // this.otpval = this.userData.otp= "";
       // this.secret= null;
      console.log(this.responseData);
      this.user_OTP = this.responseData.otp;
      console.log(this.user_OTP);
      // localStorage.setItem('OTP', JSON.stringify(this.responseData));
      // console.log(JSON.parse(localStorage.getItem('OTP')));
      
      const alert = this.alertCtrl.create({
       subTitle: this.responseData.message,
       buttons: ['OK']
       
     })
     alert.present();
      }
      else{ console.log(this.responseData.message); }
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



  register(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
     this.authService.postData(this.userData,'register')
     .then((result) => {
      this.responseData = result;

      if(this.responseData.success)
      {
        loader.dismiss();
      console.log("Response data "+this.responseData);
      localStorage.setItem('userData', JSON.stringify(this.responseData));
      console.log("Local storage "+JSON.parse(localStorage.getItem('userData')));
      const alert = this.alertCtrl.create({
        title: 'Success',
      subTitle: this.responseData.success.message,
        buttons: ['OK']
      })
      alert.present();
      this.navCtrl.push(LoginPage);
      }
      else{ loader.dismiss(); }
    },
    (err) => {
      loader.dismiss();
      this.responseData = err.json();
      console.log(this.responseData.error)
      const alert = this.alertCtrl.create({
        subTitle: this.responseData.error,
        buttons: ['OK']
      })
      alert.present();
    });

  }

  login(){
    //Login page link
    this.navCtrl.push(WelcomePage);
  }

}
