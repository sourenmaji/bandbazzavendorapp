import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ViewProductCatererPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-product-caterer',
  templateUrl: 'view-product-caterer.html',
})
export class ViewProductCatererPage {

  productDetails: any;
  productImages: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  this.productDetails = this.navParams.get('productDetails');
  console.log(this.productDetails);
}
}
