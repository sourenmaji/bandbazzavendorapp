import { Component } from '@angular/core';
import { IonicPage, MenuController, LoadingController, ActionSheetController, AlertController, NavController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { EnquiryDetailsPage } from '../enquiry-details/enquiry-details';

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
apiUrl = 'http://192.168.0.130/BandBazza/public/';


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
      this.getEnquiries(this.lastClicked);
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
            this.getEnquiries(this.categories[0]);
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
  getEnquiries(c: any)
  { 
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.lastClicked=c;
    loader.present();
    this.category=c.module_name;
    this.enquiries = [];
    this.enquiries_history = [];
    this.message="";
    console.log(this.category);
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
    console.log(this.type)
    this.authService.getData(this.type+'?id='+c.id+'&type='+this.enquiry_type,this.token).then((result) => {
      this.responseData = result;
        console.log(this.responseData)
        if(this.responseData.status==true)
        {
          if(this.responseData.enquiries)
          this.enquiries=this.responseData.enquiries;
          if(this.responseData.enquiries_history)
          this.enquiries_history=this.responseData.enquiries_history;
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

  filterEnquiry()
  {
    console.log(this.enquiry_type);
    this.getEnquiries(this.lastClicked);
  }
  
  onOpenMenu(){
    this.menuCtrl.open();
  }

  goToEnquiryDetails(details: any, module: string){
    console.log(details);
    this.navCtrl.push(EnquiryDetailsPage,{details, module});
  }
  
}
