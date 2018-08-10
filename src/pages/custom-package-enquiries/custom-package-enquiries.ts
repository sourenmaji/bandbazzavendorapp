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
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  place: any;

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
    this.loadMap();
  }
 
  loadMap(){
    let latLng = new google.maps.LatLng(22.5726, 88.3639);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
}

