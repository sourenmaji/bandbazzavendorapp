import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-view-product-banquate',
  templateUrl: 'view-product-banquate.html',
})
export class ViewProductBanquatePage {
  @ViewChild(Slides) slides: Slides;

  productDetails: any;
  requestType: any;
  productImages: any;
  lat: any;
  log: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  this.productDetails = this.navParams.get('productDetails');
  this.requestType = this.navParams.get('requestType');
  this.lat = this.productDetails.details.lat;
  this.log = this.productDetails.details.lng;
  this.productImages = this.productDetails.details.images;
  console.log(this.productDetails);
 
}
ionViewDidLoad(){
  this.lat = this.productDetails.details.lat;
  this.log = this.productDetails.details.lng;
  // this.loadMap(this.lat,this.log);
}

}
