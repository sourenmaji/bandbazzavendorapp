
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar, Platform, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { WelcomePage } from '../welcome/welcome';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { DashboardPage } from '../dashboard/dashboard';
import { GooglePlus } from '@ionic-native/google-plus';

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
    public googleplus: GooglePlus
    ) {

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
      let EMAILPATTERN =/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
      this.signupform = new FormGroup({
        numb: new FormControl(this.user_OTP),
        provider_name: new FormControl(''),
        provider_id: new FormControl(''),
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

        let isValid = false;
        console.log(this.userData.otp)
        if(this.user_OTP != this.userData.otp){
          return { 'equalsTo': {isValid} };

        }
        let input = control.value;
        isValid=this.user_OTP==input;
        if(!isValid)
        {
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
          if(this.buttonClicked)
          this.signupform.get('otp').setValidators(Validators.compose([Validators.required, Validators.minLength(6), this.equalsto('numb')]));
          console.log(this.responseData);
          this.user_OTP = this.responseData.otp;
          console.log(this.user_OTP);

          const alert = this.alertCtrl.create({
            subTitle: this.responseData.message,
            buttons: ['OK']
          })
          alert.present();
        }
        else{ console.log(this.responseData.message); }
      },
      (err) => {
        loader.dismiss();
        this.responseData = err;
        console.log(this.responseData)
        const alert = this.alertCtrl.create({
          subTitle: "Oops! Something went wrong. Please try again.",
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
          console.log("Response data ",this.responseData);
          localStorage.setItem('userData', JSON.stringify(this.responseData.success));
          console.log("Local storage ",JSON.parse(localStorage.getItem('userData')));
          const alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: this.responseData.success.message,
            buttons: ['OK']
          })
          alert.present();
          this.navCtrl.push(WelcomePage);
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

    loginWithGoogle()
    {
      let webclientid='343465164111-qjso0tvbirkuo2bsm8obk3ah41mgr38i.apps.googleusercontent.com';
      alert('google');
      // 'scopes': '','webClientId': webclientid,'offline': true
      this.googleplus.login({}).then(res => {
          alert('Logged into Google!');
          alert(JSON.stringify(res));
        })
      .catch(err => {
        alert('Error logging into Google');
          alert(err);
      });
      alert('done');
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
                localStorage.setItem('userData', JSON.stringify(this.responseData.success));
                console.log("Local storage ",JSON.parse(localStorage.getItem('userData')));
                this.navCtrl.push(DashboardPage);
              }
              else
              {
                console.log("new user "+this.responseData);
                // => Open user session and redirect to the next page
                this.signupform.get('user').setValue(user.email);
                this.signupform.get('name').setValue(user.name);
                this.signupform.get('provider_name').setValue('facebook');
                this.signupform.get('provider_id').setValue(fb_id);
              }
            },
            (err) => {
              this.responseData = err;
              console.log(this.responseData)
              const alert = this.alertCtrl.create({
                subTitle: this.responseData.message,
                buttons: ['OK']
              })
              alert.present();
            });
          });
        }// An error occurred while loging-in
        else {
          alert("Could not connect to Facebook!");
        }
      })
      .catch(e =>
        {
          console.log('Error logging into Facebook', e);
          alert(e);
        });
      }

    }
