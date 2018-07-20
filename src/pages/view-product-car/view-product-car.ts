import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-view-product-car',
  templateUrl: 'view-product-car.html',
})
export class ViewProductCarPage {

  productDetails: any;
  productImages: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  this.productDetails = this.navParams.get('productDetails');
  console.log(this.productDetails);
}
}