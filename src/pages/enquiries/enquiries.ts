import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-enquiries',
  templateUrl: 'enquiries.html',
})
export class EnquiriesPage {
categories: any;
category: string;
responseData: any;
token: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController, public authService: AuthServiceProvider) {
    
    console.log('here1');
    this.categories= ["Banquet Hall","Car Rental","Caterer"];
    this.category = "Banquet Hall";
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
  }

  ionViewWillEnter()
  {
    console.log('here2');
    this.getCategories();
  }
   ionViewDidEnter()
   {
    this.categories= ["Banquet Hall","Car Rental","Caterer","Photographer"];
    this.category = "Car Rental";
   }

  onOpenMenu(){
    this.menuCtrl.open();
  }

  getCategories()
  {
    this.authService.getData('check_my_enquiries',this.token).then((result) => {
          this.responseData = result;
            console.log(this.responseData)
        }, (err) => {
          console.log(err)
        });
  }
  
  getEnquiries(category)
  {
    console.log(this.category);
  }

}
