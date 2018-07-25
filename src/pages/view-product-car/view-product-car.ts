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
  productValue: any;
  requestType: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  this.productDetails = this.navParams.get('productDetails');
  this.requestType = this.navParams.get('requestType');
  this.productValue = this.productDetails.details.car;
  this.productImages = this.productDetails.details.images;
  console.log(this.productDetails);
}
}