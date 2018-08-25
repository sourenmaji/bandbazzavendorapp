import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform } from 'ionic-angular';

declare var google;
let lat;
let lng;

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

