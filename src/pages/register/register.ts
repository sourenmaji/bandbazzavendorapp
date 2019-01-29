import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AlertController, IonicPage, LoadingController, Navbar, NavController, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DashboardPage } from '../dashboard/dashboard';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit{
  
  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public navCtrl: NavController,
    public authService:AuthServiceProvider,
    public alertCtrl: AlertController,
    public facebook: Facebook,
    public googleplus: GooglePlus,
    public toastCtrl: ToastController
    )
    {
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
    public disableButton: boolean = false;
    private isDisabled: boolean=false;
    user_OTP: any =null;
    signupform: FormGroup;
    userData = { provider_name: "", provider_id: null, name: "",user: "",password: "",password_confirmation: "",otp: ""};
    
    
    ngOnInit()
    {
      let EMAILPATTERN =/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
      this.signupform = new FormGroup({
        numb: new FormControl(this.user_OTP),
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
    
    equalsTo(field_name): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {
        let isValid = false;
        if(this.user_OTP != control.value){
          console.log(isValid);
          console.log(this.user_OTP);
          console.log(control.value);
          return { 'equalsTo': {isValid} };
        }
        else
        {
          console.log("true");
          return null;
        }
      };
    }    
    
    showVal($value)
    {
      console.log(this.userData.user);
      console.log(!isNaN(+this.userData.user));
      if(!isNaN(+this.userData.user)){
        this.otpButton = true;
        this.disableButton = false;
      }
      else
      {
        this.otpButton = false;
        this.disableButton = true;
      }
    }
    
    sendOtp(){
      let loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present();
      this.authService.getDataWithoutToken('send_otp?phone_no='+this.userData.user).then((result: any) => {
        loader.dismiss();
        
        this.responseData = result;
        if(this.responseData.status)
        {
          this.buttonClicked = !this.buttonClicked;
          this.disableButton = !this.disableButton;
          this.isDisabled = !this.isDisabled;
          if(this.buttonClicked)
          this.signupform.get('otp').setValidators(Validators.compose([Validators.required, Validators.minLength(6), this.equalsTo('numb')]));
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
          message: 'Oops! Something went wrong.',
          duration: 5000,
          cssClass: "toast-danger",
          position: 'bottom'
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
      this.authService.getDataWithoutToken('send_otp?phone_no='+this.userData.user).then((result: any) => {
        this.responseData = result;
        loader.dismiss();
        if(result.status)
        {
          this.buttonClicked = true;
          this.disableButton = true;
          this.isDisabled = true;
          if(this.buttonClicked)
          this.signupform.get('otp').setValidators(Validators.compose([Validators.required, Validators.minLength(6), this.equalsTo('numb')]));
          
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
      console.log(this.userData);
      let loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present();
      this.authService.postData(this.userData,'register')
      .then((result) => {
        loader.dismiss();
        this.responseData = result;
        
        if(this.responseData.status)
        {
          console.log("Response data ",this.responseData);
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          console.log("Local storage ",JSON.parse(localStorage.getItem('userData')));
          const alert = this.alertCtrl.create({
            subTitle: this.responseData.message,
            buttons: ['OK']
          })
          alert.present();
          this.navCtrl.push(WelcomePage);
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
      (err) => {
        loader.dismiss();
        this.responseData = err;
        console.log(this.responseData.message)
        const toast = this.toastCtrl.create({
          message: 'Oops! Something went wrong.',
          duration: 5000,
          cssClass: "toast-danger",
          position: 'bottom'
        })
        toast.present();
      });
      
    }
    
    login(){
      //Login page link
      this.navCtrl.push(WelcomePage);
    }
    
    loginWithGoogle()
    {
      this.googleplus.login({}).then(res => {
        // alert('Logged into Google!');
        if(res.accessToken)
        {
          console.log('connected');
          let credentials=
          {
            'name': res.displayName,
            'email': res.email,
            'provider_id': res.userId,
            'provider_name':'google'
          }
          this.authService.postData(credentials,'social_login').then((result) => {
            this.responseData = result;
            
            if(this.responseData.status)
            {
              console.log(this.responseData);
              localStorage.setItem('userData', JSON.stringify(this.responseData));
              console.log("Local storage ",JSON.parse(localStorage.getItem('userData')));
              this.navCtrl.push(DashboardPage);
            }
            else
            {
              console.log("new user ");
              // => Open user session and redirect to the next page
              this.signupform.get('user').setValue(res.email);
              this.signupform.get('user').updateValueAndValidity();
              this.signupform.get('name').setValue(res.displayName);
              this.signupform.get('name').updateValueAndValidity();
              this.userData.provider_name='google';
              this.userData.provider_id=res.userId;
            }
          },
          (err) =>
          {
            this.responseData = err;
            console.log(this.responseData)
            const toast = this.toastCtrl.create({
              message: 'Oops! Something went wrong. Code:'+err,
              duration: 5000,
              cssClass: "toast-danger",
              position: 'bottom'
            })
            toast.present();
          });
        }// An error occurred while loging-in
        else
        {
          const toast = this.toastCtrl.create({
            message: 'Could not connect to Google!',
            duration: 5000,
            cssClass: "toast-danger",
            position: 'bottom'
          })
          toast.present();
        }
      })
      .catch(e =>
        {
          const toast = this.toastCtrl.create({
            message: 'Error logging into Google. Code:'+e,
            duration: 5000,
            cssClass: "toast-danger",
            position: 'bottom'
          })
          toast.present();
          console.log('Error logging into Google', e);
        });
      }
      
      loginWithFacebook()
      {
        this.facebook.login(['public_profile', 'email']).then((res: FacebookLoginResponse) =>
        {
          console.log('Logged into Facebook!', res);
          
          if(res.status == "connected")
          {
            console.log('connected');
            // Get user ID and Token
            var fb_id = res.authResponse.userID;
            // var fb_token = res.authResponse.accessToken;
            
            // Get user infos from the API
            this.facebook.api("/me?fields=name,gender,birthday,email", []).then((user) => {
              
              let credentials=
              {
                'name': user.name,
                'email': user.email,
                'provider_id':fb_id,
                'provider_name':'facebook'
              }
              this.authService.postData(credentials,'social_login').then((result) => {
                this.responseData = result;
                
                if(this.responseData.status)
                {
                  console.log(this.responseData);
                  localStorage.setItem('userData', JSON.stringify(this.responseData));
                  console.log("Local storage ",JSON.parse(localStorage.getItem('userData')));
                  this.navCtrl.push(DashboardPage);
                }
                else
                {
                  console.log("new user "+this.responseData);
                  // => Open user session and redirect to the next page
                  this.signupform.get('user').setValue(user.email);
                  this.signupform.get('name').setValue(user.name);
                  this.signupform.get('user').updateValueAndValidity();
                  this.signupform.get('name').updateValueAndValidity();
                  this.userData.provider_name='facebook';
                  this.userData.provider_id=fb_id;
                }
              },
              (err) => {
                this.responseData = err;
                console.log(this.responseData)
                const toast = this.toastCtrl.create({
                  message: 'Oops! Something went wrong.',
                  duration: 5000,
                  cssClass: "toast-danger",
                  position: 'bottom'
                })
                toast.present();
              });
            });
          }// An error occurred while loging-in
          else
          {
            const toast = this.toastCtrl.create({
              message: 'Could not connect to Facebook!',
              duration: 5000,
              cssClass: "toast-danger",
              position: 'bottom'
            })
            toast.present();
          }
        })
        .catch(e =>
          {
            console.log('Error logging into Facebook', e);
            const toast = this.toastCtrl.create({
              message: 'Error logging into Facebook',
              duration: 5000,
              cssClass: "toast-danger",
              position: 'bottom'
            })
            toast.present();
          });
        }
      }
      