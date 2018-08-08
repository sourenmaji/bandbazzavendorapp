import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-booking-details',
  templateUrl: 'booking-details.html',
})
export class BookingDetailsPage {
  responseData: any;
  token: any;
  type: string;
  message: string;
  booking: any;
  apiUrl = 'http://www.bandbazza.com/api/';

  constructor(public navCtrl: NavController, public navParams: NavParams,private authService: AuthServiceProvider) {
    this.responseData = {};
    this.authService.pageReset=false;
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
    this.booking = this.navParams.data;
    this.message="";
    console.log(this.booking)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingDetailsPage');
  }

  ionViewDidEnter()
  {
    
  }

}
