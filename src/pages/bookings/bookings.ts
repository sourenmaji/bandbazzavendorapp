import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  categories: any;
  category: string;
  responseData: any;
  token: any;
  type: string;
  bookings: any;
  offline_bookings: any;
  message: string;

  constructor(private menuCtrl: MenuController, private authService: AuthServiceProvider, private loadingCtrl: LoadingController) {
    console.log('here2');
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
  }

  ionViewDidEnter()
   {
    this.categories= [];
    this.category = "";
    this.bookings = [];
    this.offline_bookings = [];
    this.message="";
    this.getCategories();
   }

   getCategories()
   {
     //create loader
     let loader = this.loadingCtrl.create({
       content: 'Please wait...'
     });
     loader.present();
     this.authService.getData('check_my_enquiries',this.token).then((result) => {
           this.responseData = result;
             console.log(this.responseData)
             this.categories=this.responseData.categories;
             this.category=this.categories[0].module_name;
             console.log(this.categories)
             loader.dismiss();
             this.getBookings(this.categories[0]);
 
         }, (err) => {
           console.log(err)
           loader.dismiss();
         });
   }

  getBookings(c: any)
  { 
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.category=c.module_name;
    this.bookings = [];
    this.offline_bookings = [];
    this.message="";
    console.log(this.category);
    if(this.category=='Banquet Hall')
    {
      this.type="get_hall_bookings";
    }
    else if(this.category=='Car Rental')
    {
      this.type="get_car_bookings";
    }
    else if(this.category=='Caterer')
    {
      this.type="get_caterer_bookings";
    }
    console.log(this.type)
    this.authService.getData(this.type+'?id='+c.id,this.token).then((result) => {
      this.responseData = result;
        console.log(this.responseData)
        if(this.responseData.status==true)
        {
          this.bookings=this.responseData.bookings;
          this.offline_bookings=this.responseData.offline_bookings;
        }
        else
        {
          this.message=this.responseData.message;
        }
        loader.dismiss();

    }, (err) => {
      console.log(err)
      this.message="Oops! Something went wrong.";
      loader.dismiss();
    });
  }

  onOpenMenu(){
    this.menuCtrl.open();
  }

}
