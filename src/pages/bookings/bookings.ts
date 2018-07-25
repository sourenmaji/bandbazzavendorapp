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
  enquiry_type: any;
  lastClicked: any;
  selectOptions: any;
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
    this.offline_bookings = [];
    this.message="";
    this.enquiry_type=1;
    this.selectOptions = {
      title: 'Show bookings',
      buttons: []
    };
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
    console.log(this.type)
    this.authService.getData(this.type+'?id='+c.id+'&type='+this.enquiry_type,this.token).then((result) => {
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
            console.log('Upcoming clicked');
          }
        },
        {
          text: 'Past Bookings',
          handler: () => {
            console.log('Upcoming clicked');
          }
        },
        {
          text: 'Online Bookings',
          handler: () => {
            console.log('Online Bookings clicked');
          }
        },
        {
          text: 'Offline Bookings',
          handler: () => {
            console.log('Offline Bookings clicked');
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
