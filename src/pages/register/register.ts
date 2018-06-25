import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar } from 'ionic-angular';
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
   constructor(public navCtrl: NavController, public authService:AuthServiceProvider, public alertCtrl: AlertController ) {
  }

  ionViewDidLoad(){
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.navCtrl.setRoot(WelcomePage);
     }
    }
  responseData : any;
  

  signupform: FormGroup;
  userData = { name: "",email: "",password: "",password_confirmation: ""};


  ngOnInit() {
    let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.signupform = new FormGroup({
      // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])),
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
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
    

  register(){
    console.log(this.userData)
     this.authService.postData(this.userData,'register')
     .then((result) => {
      this.responseData = result;

      if(this.responseData.success)
      {
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
      else{ console.log('hfgvrhejgrehgrjheg'); }
    },
    (err) => {
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
    this.navCtrl.push(LoginPage);
  }

}
