import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  
  userDetails : any;
  responseData: any;
  car_enquiry: number;
  caterer_enquiry: number;
  hall_enquiry: number;
  car_booking: number;
  caterer_booking: number;
  hall_booking: number;

  userPostData = {"user":"", "token":""};
  device_token: any = null;
  constructor(
    public navCtrl: NavController,
    private menuCtrl: MenuController,
    public platform: Platform,
    private authService: AuthServiceProvider,
    public toastCtrl: ToastController)
    {
      this.userDetails = JSON.parse(localStorage.getItem('userData'));
      console.log(this.userDetails);
      
      this.device_token = JSON.parse(localStorage.getItem('device_token'));
      console.log('token_from_storage',this.device_token);
      this.userPostData.user = this.userDetails.user;
      this.userPostData.token = this.userDetails.token;
      console.log(this.userPostData.token);
      let backAction =  platform.registerBackButtonAction(() => {
        this.navCtrl.pop();
        backAction();
      },2);
    }
    
    ionViewDidLoad()
    {
      console.log('ionViewDidLoad AfterLoginPage');

      if(this.device_token) {
        this.sendToken();
      }
      
      this.getDashboardData();
    }
    onOpenMenu(){
      this.menuCtrl.open();
    }
    sendToken()
    {
      let device_data = {
        device_token : this.device_token,
        device_platform : this.platform.is('android') ? 'android' : 'ios',
        device_id : ''
      }
      
      this.authService.authData(device_data,'send_device_token',this.userPostData.token).then((result: any) => {
        this.responseData = result;
        console.log(this.responseData);
        if(this.responseData.status)
        {
          console.log('token created');
        }
        else
        {
          console.log('token exists');
        }
      }, (err) =>
      {
        console.log(err);
        const toast = this.toastCtrl.create({
          message: 'Oops! Something went wrong.',
          duration: 5000,
          cssClass: "toast-danger",
          position: 'bottom'
        })
        toast.present();
      });
    }

    getDashboardData()
    {
      this.authService.getData('dashboard',this.userPostData.token).then((result) => {
        
        this.responseData = result;
        console.log(this.responseData);
        if(this.responseData.status)
        {
          this.car_enquiry=this.responseData.car_enquiry;
          this.caterer_enquiry=this.responseData.caterer_enquiry;
          this.hall_enquiry=this.responseData.hall_enquiry;
          this.car_booking=this.responseData.car_booking;
          this.caterer_booking=this.responseData.caterer_booking;
          this.hall_booking=this.responseData.hall_booking;
        }
        else
        {
        }
      },
      (err) => {
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
  }
  