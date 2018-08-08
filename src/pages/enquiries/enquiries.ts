import { Component } from '@angular/core';
import { IonicPage, MenuController, LoadingController, ActionSheetController, AlertController, NavController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { EnquiryDetailsPage } from '../enquiry-details/enquiry-details';
let scroll = null;
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
type: string;
enquiries: any;
enquiries_history: any;
enquiry_type: any;
lastClicked: any;
message: string;
selectOptions: any;
next_page: number;
page: number;
params: any;
apiUrl = 'http://192.168.0.130/BandBazza/public/api/';


  constructor(private menuCtrl: MenuController, private navCtrl: NavController, private authService: AuthServiceProvider, private loadingCtrl: LoadingController, private actionCtrl: ActionSheetController, private alertCtrl: AlertController) {
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
    this.authService.pageReset=false;

  }

  ionViewDidLoad(){
        //initialize all variables with default values and call the service
        this.categories= [];
        this.category = "";
        this.enquiries = [];
        this.enquiries_history = [];
        this.message="";
        this.enquiry_type="active";
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
      this.getEnquiries(this.lastClicked,true);
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
            if(this.categories.length){
            this.category=this.categories[0].module_name;
            console.log(this.categories)
            loader.dismiss();
            this.getEnquiries(this.categories[0],true);
            }
            else
            {
              const alert = this.alertCtrl.create({
                subTitle: 'No Business Added Yet',
                buttons: ['OK']
              })
              loader.dismiss();
              alert.present();
            }
        }, (err) => {
          loader.dismiss();
          console.log(err)
        });
  }

  //get enquiries of a particular module
  getEnquiries(c: any, reset:boolean)
  {
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.lastClicked=c;
    loader.present();
    this.category=c.module_name;
    this.enquiries = [];

    this.message="";

    if(this.category=='Banquet Hall')
    {
      this.type="get_hall_enquiries";
    }
    else if(this.category=='Car Rental')
    {
      this.type="get_car_enquiries";
    }
    else if(this.category=='Caterer')
    {
      this.type="get_caterer_enquiries";
    }

    //if there's no next page or the page needs to be manually refreshed, reset values to default
    if(!this.next_page || reset)
    {
      this.enquiries = [];
      this.page=1;
    }

    //takes category id, filter value and page no and calls service
    this.params= {id: c.id, type: this.enquiry_type, page: this.page };

    console.log(this.type)
    this.authService.getDataParams(this.type, this.params, this.token).then((result) => {
      this.responseData = result;
        console.log(this.responseData)
        //if there's existing enquiries
        if(this.responseData.status==true)
        {
          console.log(this.responseData.enquiries.data)

          //pushing to array because pagination call will add to the existing array if any value is present
          this.responseData.enquiries.data.forEach(enquiry => {
            this.enquiries.push(enquiry);
          });

          //if there's pagination value
          if(this.responseData.enquiries.next_page_url)
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
        else //if there's no enquiries
        {
          this.next_page=0;
          this.message=this.responseData.message;
        }
        loader.dismiss();

    }, (err) => {
      loader.dismiss();
      console.log(err)
      this.message="Oops! Something went wrong.";

    });
  }

  filterEnquiries()
  {
    const actionSheet = this.actionCtrl.create({
      title: 'Show booking by',
      buttons: [
        {
          text: 'Active Enquiries',
          handler: () => {
            this.enquiry_type='active';
            console.log('Active clicked');
            this.getEnquiries(this.lastClicked,true);
          }
        },
        {
          text: 'Past Enquiries',
          handler: () => {
            this.enquiry_type='history';
            console.log('history clicked');
            this.getEnquiries(this.lastClicked,true);
          }
        }
      ]
    });
    actionSheet.present();
  }

  onOpenMenu(){
    this.menuCtrl.open();
  }

  goToEnquiryDetails(details: any, module: string){
    console.log(details);
    this.navCtrl.push(EnquiryDetailsPage,{details, module});
  }

  loadMore(infiniteScroll)
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
        this.getEnquiries(this.lastClicked,false);
      }
  }

}
