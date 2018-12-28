import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-custom-package-enquiries',
  templateUrl: 'custom-package-enquiries.html',
})

export class CustomPackageEnquiriesPage {

  constructor(public navCtrl: NavController, private menuCtrl: MenuController, public platform: Platform) {
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }

  onOpenMenu()
  {
    this.menuCtrl.open();
  }

  ionViewDidLoad(){

  }

}

