import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, MenuController, AlertController, Platform } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

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
  newU = {"success": {"token":"","user":""}};
  public buttonClicked: boolean = false;
  public otpButton: boolean = true;
  public disableButton: boolean = false;
  public otpmessage="";
  //public otpval = "123456";
  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public authService: AuthServiceProvider,
              public alertCtrl: AlertController, public platform: Platform) {

                const data = JSON.parse(localStorage.getItem('userData'));
                this.userDetails = data.success.user;
                if(this.userDetails.phone_no != null){
                  this.user_phone = this.userDetails.phone_no;
                }
                if(this.userDetails.phone_verify != null && this.userDetails.phone_verify == 1){
                  this.otpButton = !this.otpButton;
                  this.disableButton = true;
                }
                console.log(this.userDetails);
            
                this.userPostData.user = this.userDetails;
                this.userPostData.token = data.success.token;
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

  equals(field_name): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      
      let isValid = false;
      //console.log(this.userData.otp)
    //let input = control.value;
    if(this.userDetails.phone_no != null){
      this.user_phone = this.userDetails.phone_no;
      isValid=this.user_phone==this.userData.phone_no;
      if(!isValid){
        return { 'equalTo': {isValid} };
      }
      else 
    return null;
    }
  };
    }


  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      // if(!this.buttonClicked)
      // {
      //     console.log( { 'equalTo': false });
      //     return { 'equalTo': false };
      // }
      let isValid = false;
      console.log(this.userData.otp)
      if(this.user_OTP != this.userData.otp){
        return { 'equalTo': {isValid} };
        
      }
    let input = control.value;
    //console.log(this.user_OTP);
    isValid=this.user_OTP==input;
    if(!isValid) 
    {
      //console.log( { 'equalTo': {isValid} });
      return { 'equalTo': {isValid} };
    }
    else 
    return null;
    };
    }
    
  sendOtp(){
    
    this.authService.getData('send_otp?phone_no='+this.userData.phone_no,this.userPostData.token).then((result: any) => {
      this.responseData = result;
      if(result.status)
      {
        this.buttonClicked = !this.buttonClicked;
        this.disableButton = !this.disableButton;
        if(this.buttonClicked)
        this.editform.get('otp').setValidators(Validators.compose([Validators.required, Validators.minLength(6), this.equalto('numb')]));
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
     this.responseData = err.json();
     console.log(this.responseData)
     const alert = this.alertCtrl.create({
       subTitle: this.responseData.message,
       buttons: ['OK']
     })
     alert.present();
    });
  }


  editProfile(){
   
    this.authService.authData(this.userData,'edit_profile',this.userPostData.token).then((result: any) => {
      this.responseData = result;
      if(result.status)
      {
        this.buttonClicked = !this.buttonClicked;
        this.disableButton = !this.disableButton;
      console.log(this.responseData);
     this.editUserDetails = this.responseData;
     this.userDetails = this.editUserDetails.success.user;
     this.newU.success.user = this.userDetails;
     this.newU.success.token = this.userPostData.token;
       localStorage.setItem('userData', JSON.stringify(this.newU));
      const alert = this.alertCtrl.create({
       subTitle: this.responseData.success.message,
       buttons: ['OK']
       
     })
     alert.present();
     this.navCtrl.pop();
      }
      else{ console.log(this.responseData.error); }
    }, (err) => {
     this.responseData = err.json();
     console.log(this.responseData)
     const alert = this.alertCtrl.create({
       subTitle: this.responseData.success.error,
       buttons: ['OK']
     })
     alert.present();
    });
  }

  onOpenMenu(){
    this.menuCtrl.open();
  }
}
