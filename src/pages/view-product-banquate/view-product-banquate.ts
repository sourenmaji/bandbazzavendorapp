import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-view-product-banquate',
  templateUrl: 'view-product-banquate.html',
})
export class ViewProductBanquatePage {
  
  productDetails: any;
  productImages: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  this.productDetails = this.navParams.get('productDetails');
  this.productImages = this.productDetails.details.images;
  console.log(this.productDetails);
}
}
