import { Component } from '@angular/core';
import { MenuController, NavController, NavParams, Platform, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userDetails : any;
  responseData: any;

  userPostData = {"user":"","token":""};
  userPassword = {"password":"","password_confirmation":""};

  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.token;
    console.log(this.userPostData.token);
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }
  ionViewDidEnter()
  {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.token;
    console.log(this.userPostData.token);
  }
  editProfile()
  {
    this.navCtrl.push('EditProfilePage');
  }

  onOpenMenu()
  {
  this.menuCtrl.open();
  }

}
