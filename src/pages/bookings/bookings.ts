import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BookingDetailsPage } from '../booking-details/booking-details';

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
  filter_type: any;
  page: number;
  lastClicked: any;

  params: any;
  apiUrl = 'http://192.168.0.130/BandBazza/public/';

  constructor(private menuCtrl: MenuController, private navCtrl: NavController, private actionCtrl: ActionSheetController, private authService: AuthServiceProvider, private loadingCtrl: LoadingController) {
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
    this.authService.pageReset=false;
  }

  ionViewDidLoad()
   {
    //initialize all variables with default values and call the service
    this.categories= [];
    this.category = "";
    this.bookings = [];
    this.message="";
    this.filter_type='upcoming';
    this.page=1;

    this.getCategories();
   }

   ionViewDidEnter()
   {
     if(this.authService.pageReset)
     {
       console.log(this.authService.pageReset)
       this.getBookings(this.lastClicked);
     }
   }

  //get business categories of this vendor
   getCategories()
   {
     //create loader
     let loader = this.loadingCtrl.create({
       content: 'Please wait...'
     });
     loader.present();
     this.authService.getData('get_added_business',this.token).then((result) => {
           this.responseData = result;
             console.log(this.responseData)
             this.categories=this.responseData.categories;
             this.category=this.categories[0].module_name;
             console.log(this.categories)
             loader.dismiss();
             this.getBookings(this.categories[0]);
         }, (err) => {
          loader.dismiss();
          console.log(err)
         });
   }

//get bookings of a particular module
  getBookings(c: any)
  { 
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.lastClicked=c;
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
    this.params= {id: c.id, type: this.filter_type, page: this.page }
    console.log(this.type)
    this.authService.getDataParams(this.type, this.params, this.token).then((result) => {
      this.responseData = result;
        console.log(this.responseData)
        if(this.responseData.status==true)
        {
          console.log(this.responseData.all_bookings.data)
          if(this.responseData.all_bookings.data.length)
          this.bookings=this.responseData.all_bookings.data;
        }
        else
        {
          this.message=this.responseData.message;
        }
        loader.dismiss();

    }, (err) => {
      loader.dismiss();
      console.log(err)
      this.message="Oops! Something went wrong.";
    });
  }

  filterBookings()
  {
    // console.log(this.enquiry_type);
    // this.getBookings(this.lastClicked);
    const actionSheet = this.actionCtrl.create({
      title: 'Show booking by',
      buttons: [
        {
          text: 'Upcoming',
          handler: () => {
            this.filter_type='upcoming';
            console.log('Upcoming clicked');
            this.getBookings(this.lastClicked);
          }
        },
        {
          text: 'Past Bookings',
          handler: () => {
            this.filter_type='past';
            console.log('Past clicked');
            this.getBookings(this.lastClicked);
          }
        },
        {
          text: 'Online Bookings',
          handler: () => {
            this.filter_type='online';
            console.log('Online Bookings clicked');
            this.getBookings(this.lastClicked);
          }
        },
        {
          text: 'Offline Bookings',
          handler: () => {
            this.filter_type='offline';
            console.log('Offline Bookings clicked');
            this.getBookings(this.lastClicked);
          }
        }
      ]
    });
    actionSheet.present();
  }


  onOpenMenu(){
    this.menuCtrl.open();
  }

  goToBookingDetails(details: any, module: string, type: string){
    console.log(module);
    console.log('BookingDetailsPage')
    this.navCtrl.push(BookingDetailsPage,{details, module, type});
  }

}
