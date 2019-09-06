import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, IonicPage, LoadingController, MenuController, NavController, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage{
  userPostData = {"user":"","token":""};
  
  userDetails : any;
  responseData: any;
  newUserData = {"token":"","user":""};
  
  private otpSent = false;
  private otpStatus = 'Send OTP';
  private otpButton: boolean;
  private otpMatch = false;
  
  public editform: FormGroup;
  public userData = { name: "",email: "",phone_no: "",address: "",otp: ""};
  
  EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  PHONEPATTERN = /^[0-9]{10}$/;
  
  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
      
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.user;
      
      
      this.userPostData.user = this.userDetails;
      this.userPostData.token = data.token;
      console.log(this.userPostData);
      
      let backAction =  platform.registerBackButtonAction(() => {
        this.navCtrl.pop();
        backAction();
      },2);
      
      this.editform = new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'),
        Validators.minLength(3), Validators.maxLength(30)])),
        email: new FormControl(''),
        phone_no: new FormControl(''),
        otp: new FormControl(''),
        otp_confirmation: new FormControl(''),
        address: new FormControl(''),
      });
      this.checkEmailChanges();
      this.checkPhoneChanges();
      this.setUserData();
      this.otpButton = false;
      console.log('editform',this.editform.value);
    }
    
    setUserData() {
      console.log(this.userDetails);
      this.editform.patchValue({
        name: this.userDetails.name,
        email: this.userDetails.email,
        phone: this.userDetails.phone_no,
        address: this.userDetails.address
      });
    }
    
    phoneCheck(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        const field = control.value;
        console.log(field);
        if (field && field.toString().length !== 10) {
          console.log('error');
          return { phoneCheck: true };
        } else {
          console.log('null');
          return null;
        }
      };
    }
    
    equalTo(field: string): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        const parent = control.root;
        
        if (parent.get(field) && control.value != parent.get(field).value) {
          return { equalTo: true };
        } else {
          return null;
        }
      };
    }
    
    checkPhoneChanges() {
      const control = this.editform.get('phone_no');
      
      if (control.value) {
        control.setValidators([Validators.compose([Validators.required,
          this.phoneCheck()])]);
        } else {
          control.setValidators([this.phoneCheck()]);
        }
        
        control.updateValueAndValidity();
        
        console.log(control.hasError('phoneCheck'));
        if (control.value && (control.value !== this.userDetails.phone_no) && control.hasError('phoneCheck') === false) {
          this.otpButton = true;
        } else {
          this.otpButton = false;
        }
      }
      
      checkEmailChanges() {
        this.editform.get('email').clearValidators();
        
        if (this.editform.get('email').value) {
          this.editform.get('email').setValidators([Validators.compose([Validators.required,
            Validators.pattern(this.EMAILPATTERN)])]);
          } else {
            this.editform.get('email').setValidators([Validators.pattern(this.EMAILPATTERN)]);
          }
          this.editform.get('email').updateValueAndValidity();
        }
        
        checkOtpMatch() {
          const control = this.editform.get('otp');
          
          if (control.value && control.hasError('equalTo') === false) {
            this.otpButton = false;
            this.otpMatch = true;
          } else {
            this.otpButton = true;
            this.otpMatch = false;
          }
        }
        
        sendOtp(){
          const control = this.editform.get('otp_confirmation');
          this.otpSent = true;
          this.otpStatus = 'Resend OTP';
          control.setValue('');
          let loader = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loader.present();
          this.authService.getData('send_otp?phone_no='+this.editform.get('phone_no').value,this.userPostData.token).then((result: any) => {
            this.responseData = result;
            if(result.status)
            {
              loader.dismiss();
              console.log(this.responseData);
              
              control.setValue(this.responseData.otp);
              this.editform.get('otp').setValue('');
              this.editform.get('otp').clearValidators();
              this.editform.get('otp').setValidators([Validators.compose([Validators.required,
                this.equalTo('otp_confirmation')])]);
                this.editform.get('otp').updateValueAndValidity();
                
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
                duration: 5000,
                position: 'bottom'
              })
              toast.present();
            });
          }
          
          
          editProfile()
          {
            this.userData = this.editform.value;
            console.log(this.userData);
            
            this.authService.authData(this.userData,'edit_profile',this.userPostData.token).then((result: any) => {
              this.responseData = result;
              if(result.status)
              {
                console.log(this.responseData);
                this.userDetails = this.responseData.user;
                this.newUserData.user = this.responseData.user;
                this.newUserData.token = this.userPostData.token;
                localStorage.setItem('userData', JSON.stringify(this.newUserData));
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
        