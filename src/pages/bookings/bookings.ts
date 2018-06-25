import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private menuCtrl: MenuController) {
  }

  onOpenMenu(){
this.menuCtrl.open();
  }

}
