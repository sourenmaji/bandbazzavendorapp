import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, LoadingController, ActionSheetController, AlertController, Platform, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BookingDetailsPage } from '../booking-details/booking-details';
let scroll = null;
@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  categories: any;
  category_id: number;
  category_name: string;
  responseData: any;
  token: any;
  type: string;
  bookings: any;
  message: string;
  filter_type: any;
  page: number;
  lastClicked: any;
  next_page: number;
  params: any;
  imageUrl: string = '';

  constructor(private menuCtrl: MenuController,
    private navCtrl: NavController,
    private actionCtrl: ActionSheetController,
    private authService: AuthServiceProvider,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParams: NavParams
  ) {
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.token;
    this.categories= [];

    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }

  ionViewDidLoad()
   {
    //initialize all variables with default values and call the service
    // this.categories= [];
    this.category_id = 0;
    this.category_name='';
    this.bookings = [];
    this.message = "";
    this.filter_type = 'online future';
    this.page = 1;
    this.next_page = 0;
    this.imageUrl = this.authService.imageUrl;
    this.getCategories();
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
          loader.dismiss();
           this.responseData = result;
             console.log(this.responseData)
             this.categories=this.responseData.categories;
             if(this.categories.length){
             console.log(this.categories)

            if(this.navParams.get('category')){
              this.getBookings(this.navParams.get('category'), true);
             }
             else
             {
              this.getBookings(this.categories[0],true);
             }

             }
             else{
              const alert = this.alertCtrl.create({
                subTitle: 'No Business Added Yet',
                buttons: ['OK']
              })
              alert.present();
              loader.dismiss();
            }
         }, (err) => {
          loader.dismiss();
          console.log(err)
         });
   }

//get bookings of a particular module
  getBookings(c: any, reset: boolean)
  {
    console.log(c);
    //save the last clicked category to directly trigger it
    this.lastClicked=c;
    this.category_id=c.module_id;
    this.category_name=c.module_name;

    this.message="Fetching your bookings...";

    console.log(this.category_id);
    console.log(this.bookings);
    console.log(this.next_page);
    console.log(this.message);
    console.log(this.page);

    if(this.category_id==2)
    {
      this.type="get_hall_bookings";
    }
    else if(this.category_id==3)
    {
      this.type="get_car_bookings";
    }
    else if(this.category_id==4)
    {
      this.type="get_caterer_bookings";
    }


    //if there's no next page or the page needs to be manually refreshed, reset values to default
    if(!this.next_page || reset)
    {
      this.bookings = [];
      this.page=1;
    }

    //takes category id, filter value and page no and calls service
    this.params= {id: c.id, type: this.filter_type, page: this.page };

    this.authService.getDataParams(this.type, this.params, this.token).then((result) => {
      this.responseData = result;
        console.log(this.responseData)
        //if there's existing booking
        if(this.responseData.status==true)
        {
          console.log(this.responseData.bookings.data)

          //pushing to array because pagination call will add to the existing array if any value is present
          this.responseData.bookings.data.forEach(booking => {
            this.bookings.push(booking);
          });

          //if there's pagination value
          if(this.responseData.bookings.next_page_url)
          {
            this.next_page=this.next_page+1;
          }
          else
          {
            this.next_page=0;
            this.message= "End of results"
          }

          if(scroll)
          {
            scroll.complete();
            console.log('Pagination values fetched');
          }

        }
        else //if there's no bookings
        {
          this.next_page=0;
          this.message=this.responseData.message;
        }
    },
    (err) => {
      console.log(err)
      this.message="Oops! Something went wrong.";
    });
  }

  filterBookings()
  {
    const actionSheet = this.actionCtrl.create({
      title: 'Show booking by',
      buttons: [
        {
          text: 'Upcoming online',
          handler: () => {
            this.filter_type='online future';
            console.log('Upcoming clicked');
            this.getBookings(this.lastClicked,true);
          }
        },
        {
          text: 'Past online',
          handler: () => {
            this.filter_type='online past';
            console.log('Past clicked');
            this.getBookings(this.lastClicked,true);
          }
        },
        {
          text: 'Upcoming offline',
          handler: () => {
            this.filter_type='offline future';
            console.log('Online Bookings clicked');
            this.getBookings(this.lastClicked,true);
          }
        },
        {
          text: 'Past offline',
          handler: () => {
            this.filter_type='offline past';
            console.log('Offline Bookings clicked');
            this.getBookings(this.lastClicked,true);
          }
        }
      ]
    });
    actionSheet.present();
  }

  onOpenMenu(){
    this.menuCtrl.open();
  }

  goToBookingDetails(details: any, module: number, type: string){
    console.log(module);
    console.log('BookingDetailsPage')
    this.navCtrl.push(BookingDetailsPage,{details, module, type});
  }

  loadMore(infiniteScroll: any)
  {
    console.log('Getting paginated values...');
    scroll=infiniteScroll;
    console.log(scroll);
    //if next page exists apply infinite scroll
      if(this.next_page)
      {
        this.page=this.next_page+1;
        console.log(this.page);
        //reset = false, because updated value needs to be passed to service call, page not to be refreshed
        this.getBookings(this.lastClicked,false);
      }
  }

}
