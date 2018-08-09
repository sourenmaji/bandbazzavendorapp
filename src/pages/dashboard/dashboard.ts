import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  userDetails : any;
  userPostData = {"user":"","token":""};
  constructor(public navCtrl: NavController,
              private menuCtrl: MenuController, public platform: Platform) 
  {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
    console.log(this.userPostData.token);
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AfterLoginPage');
  }
  onOpenMenu(){
    this.menuCtrl.open();
    }


}
