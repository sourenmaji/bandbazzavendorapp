import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  userDetails : any;
  responseData: any;
  userPostData = {"user":"","token":""};
  device_token: any = null;
  constructor(public navCtrl: NavController,
              private menuCtrl: MenuController,
              public platform: Platform,
              private authService: AuthServiceProvider)
  {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.user;

    this.device_token = localStorage.getItem('device_token');

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.token;
    console.log(this.userPostData.token);
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AfterLoginPage');
    if(this.device_token)
    this.sendToken();
  }
  onOpenMenu(){
    this.menuCtrl.open();
    }
  sendToken()
  {
    this.authService.getData('send_device_token?device_token='+this.device_token,this.userPostData.token).then((result: any) => {
      this.responseData = result;
      if(result.status)
      {
       console.log('token created');
      }

    }, (err) => {
      // alert(err);
    });
  }
}
