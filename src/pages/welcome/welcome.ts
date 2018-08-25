import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar, Platform,ToastController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import {Network} from '@ionic-native/network';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage implements OnInit{

  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController, public toast: ToastController,public network: Network, public platform: Platform,public authService:AuthServiceProvider, public alertCtrl: AlertController) {}
  signinform: FormGroup;
  responseData : any;
  userData = {password: "", email: ""};
  
  ionViewDidLoad() {
    this.platform.registerBackButtonAction(() => {
      this.platform.exitApp();
      console.log("backPressed 1");
    },1);
  
    //  this.platform.ready().then(() => {
    //   let connectSubscription = this.network.onConnect().subscribe(() =>{
    //   console.log('network was connected :-(');
    //    this.toast.create({
    //     message: 'Network connected',
    //    duration: 3000
    //   }).present();
    // });

    // connectSubscription.unsubscribe();
    // let disconnectSubscription  = this.network.onDisconnect().subscribe(() =>{
    //       console.log('network was disconnected :-(');
    //       this.toast.create({
    //         message: 'Network Disconnected',
    //         duration: 3000
    //       }).present();
    //     });
    //     disconnectSubscription.unsubscribe();
    // });
  }

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
       else{
          console.log(this.responseData.error); 
          const alert = this.alertCtrl.create({
            subTitle: this.responseData.error,
            buttons: ['OK']
          })
          alert.present();
        }
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

  
  // login(){
  // this.navCtrl.push(LoginPage);
  // }

  // register(){
  //   console.log("hggh");
  // this.navCtrl.push(RegisterPage);
  // }
}