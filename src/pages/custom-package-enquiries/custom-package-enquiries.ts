import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-custom-package-enquiries',
  templateUrl: 'custom-package-enquiries.html',
})
export class CustomPackageEnquiriesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController) {
  }

  onOpenMenu(){
this.menuCtrl.open();
  }
}
