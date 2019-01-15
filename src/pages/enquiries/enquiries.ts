import { Component } from '@angular/core';
import { ActionSheetController, ToastController, IonicPage, LoadingController, MenuController, NavController, NavParams, Platform } from 'ionic-angular';
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
category_id: number;
category_name: string;
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
notify_category: string="";
imageUrl:string = '';


  constructor(public platform: Platform, public navParams: NavParams, private menuCtrl: MenuController, private navCtrl: NavController, private authService: AuthServiceProvider, private loadingCtrl: LoadingController, private actionCtrl: ActionSheetController, private toastCtrl: ToastController) {
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.token;
    this.authService.pageReset=false;
    this.categories= [];
    if(this.navParams.get('category'))
    this.notify_category=this.navParams.get('category');
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)

  }

  ionViewDidLoad(){
        //initialize all variables with default values and call the service
        // this.categories= [];
        this.category_id = 0;
        this.category_name = '';
        this.enquiries = [];
        this.enquiries_history = [];
        this.message="";
        this.enquiry_type="active";
        this.imageUrl = this.authService.imageUrl;
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
          loader.dismiss();
          this.responseData = result;
            console.log(this.responseData)
            this.categories=this.responseData.categories;
            if(this.categories.length){
            console.log(this.categories)
            this.getEnquiries(this.categories[0],true);
            }
            else
            {
              const toast = this.toastCtrl.create({
                message: 'No Business Added Yet',
                duration: 3000,
                position: 'top'
              })
              toast.present();
            }
        }, (err) => {
          loader.dismiss();
          console.log(err);
          const toast = this.toastCtrl.create({
            message: 'Oops! Something went wrong.',
            duration: 3000,
            position: 'top'
          })
          toast.present();
        });
  }

  //get enquiries of a particular module
  getEnquiries(c: any, reset:boolean)
  {
    console.log(c);
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.lastClicked=c;
    loader.present();
    this.category_name=c.module_name;
    this.category_id=c.module_id;
    this.enquiries = [];

    this.message="";

    if(this.category_id==2)
    {
      this.type="get_hall_enquiries";
    }
    else if(this.category_id==3)
    {
      this.type="get_car_enquiries";
    }
    else if(this.category_id==4)
    {
      this.type="get_caterer_enquiries";
    }
    else if(this.category_id==5)
    {
      this.type="get_photography_enquiries";
    }
    else if(this.category_id==6)
    {
      this.type="get_makeup_enquiries";
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
      loader.dismiss();
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
    }, (err) => {
      loader.dismiss();
      console.log(err)
      this.message="Oops! something went wrong.";
      const toast = this.toastCtrl.create({
        message: 'Oops! Something went wrong.',
        duration: 3000,
        position: 'top'
      })
      toast.present();
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

  goToEnquiryDetails(details: any, module: number){
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
