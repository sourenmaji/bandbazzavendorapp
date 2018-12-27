import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, Platform } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';



@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userDetails : any;
  responseData: any;

  userPostData = {"user":"","token":""};
  userPassword = {"password":"","password_confirmation":""};

  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController, private alertCtrl: AlertController) {
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
  ionViewDidEnter(){
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.token;
    console.log(this.userPostData.token);
    
  }
  editProfile(){
    this.navCtrl.push(EditProfilePage);
  }

  // editProfile(){
  //   this.authService.authData('get_all_business',this.userPostData.token).then((result) => {
  //    this.responseData = result;
  //    if(this.responseData.success)
  //    {
  //    console.log(this.responseData);
  //    localStorage.setItem('userData', JSON.stringify(this.responseData));
  //    console.log("Local storage "+JSON.parse(localStorage.getItem('userData')));
  //    const alert = this.alertCtrl.create({
  //     subTitle: this.responseData.success.message,
  //     buttons: ['OK']
  //   })
  //   alert.present();
  //    }
  //    else{ console.log(this.responseData.error); }
  //  }, (err) => {
  //   this.responseData = err.json();
  //   console.log(this.responseData)
  //   const alert = this.alertCtrl.create({
  //     subTitle: this.responseData.error,
  //     buttons: ['OK']
  //   })
  //   alert.present();
  //  });
  // }
  
  onOpenMenu(){
this.menuCtrl.open();
  }

}
