import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { AlertController, IonicPage, LoadingController, Navbar, NavController, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { NetworkProvider } from '../../providers/network-provider/network_provider';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

export enum ConnectionStatusEnum {
  Online,
  Offline
}
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage implements OnInit
{
  previousStatus;
  signinform: FormGroup;
  responseData : any;
  userData = {password: "", email: ""};
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public loadingCtrl : LoadingController,
    public navCtrl: NavController,
    public toast: ToastController,
    public network: Network,
    public platform: Platform,
    public authService:AuthServiceProvider,
    public alertCtrl: AlertController,
    public networkProvider: NetworkProvider,
    public toastCtrl: ToastController,
    public facebook: Facebook,
    public googleplus: GooglePlus)
    {
      this.previousStatus = ConnectionStatusEnum.Online;
    }
    
    ionViewDidLoad()
    {
      console.log(this.networkProvider.networkState);
      this.platform.registerBackButtonAction(() => {
        this.platform.exitApp();
        console.log("backPressed 1");
      },1);
    }
    

    ngOnInit()
    {
      let EMAILPATTERN =/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|[0-9]{10}$/;
      this.signinform = new FormGroup({
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)])
      });
    }
    
    login()
    {
      let loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present();
      console.log(JSON.stringify(this.userData))
      this.authService.postData(this.userData,'login').then((result) => {
        loader.dismiss();
        this.responseData = result;
        
        if(this.responseData.status)
        {
          console.log(this.responseData);
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          console.log("Local storage "+JSON.parse(localStorage.getItem('userData')));
          this.navCtrl.push('DashboardPage');
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
      }, (err) =>
      {
        loader.dismiss();
        this.responseData = err;
        console.log(this.network.type);
        if(this.network.type === 'none')
        this.navCtrl.push('ErrorPage');
        console.log(this.responseData);
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
      //Register page link
      this.navCtrl.push('RegisterPage');
    }
    
    forgetPassword()
    {
      this.navCtrl.push('ForgetPasswordPage');
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
          let loader = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loader.present();
          this.authService.postData(credentials,'social_login').then((result) => {
            this.responseData = result;
            loader.dismiss();
            if(this.responseData.status)
            {
              console.log(this.responseData);
              localStorage.setItem('userData', JSON.stringify(this.responseData));
              console.log("Local storage ",JSON.parse(localStorage.getItem('userData')));
              this.navCtrl.push('DashboardPage');
            }
            else
            {
              console.log("new user ");
              this.navCtrl.push('RegisterPage',{'name':res.displayName,'user':res.email,'provider_name':'google','provider_id':res.userId});
            }
          },
          (err) =>
          {
            loader.dismiss();
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
              let loader = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loader.present();
              this.authService.postData(credentials,'social_login').then((result) => {
                this.responseData = result;
                loader.dismiss();
                
                if(this.responseData.status)
                {
                  console.log(this.responseData);
                  localStorage.setItem('userData', JSON.stringify(this.responseData));
                  console.log("Local storage ",JSON.parse(localStorage.getItem('userData')));
                  this.navCtrl.push('DashboardPage');
                }
                else
                {
                  console.log("new user "+this.responseData);
                  this.navCtrl.push('RegisterPage',{'name':user.name,'user':user.email,'provider_name':'facebook','provider_id':fb_id});
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
  
  