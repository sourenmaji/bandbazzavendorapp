import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  userDetails : any;
  userPostData = {"user":"","token":""};
  constructor(public navCtrl: NavController,
              private menuCtrl: MenuController) 
  {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
    console.log(this.userPostData.token);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AfterLoginPage');
  }
  onOpenMenu(){
    this.menuCtrl.open();
    }


}
