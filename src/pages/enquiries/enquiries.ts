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
lastClicked: any;
message: string;
apiUrl = 'http://192.168.0.130/BandBazza/public/';

  constructor(private menuCtrl: MenuController, private navCtrl: NavController, private authService: AuthServiceProvider, private loadingCtrl: LoadingController, private actionCtrl: ActionSheetController, private alertCtrl: AlertController) {
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
  }

   ionViewDidEnter()
   {
    //initialize all variables with default values and call the service
    this.categories= [];
    this.category = "";
    this.enquiries = [];
    this.enquiries_history = [];
    this.message="";
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
    this.authService.getData(this.type+'?id='+c.id,this.token).then((result) => {
      this.responseData = result;
        console.log(this.responseData)
        if(this.responseData.status==true)
        {
          this.enquiries=this.responseData.enquiries;
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

  //approve or decline an enquiry actionsheet
  enquiryAction(enquiry_id: number, module: string) {
    console.log(enquiry_id);
    console.log(module);
    //show action sheet
    const actionSheet = this.actionCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Approve',
          handler: () => {
            console.log('Approve clicked');
            //1 is for approve, 0 is for decline
            this.enquiryApproval(enquiry_id,module,1);
          }
        },
        {
          text: 'Decline',
          handler: () => {
            console.log('Decline clicked');
             //1 is for approve, 0 is for decline
             this.enquiryApproval(enquiry_id,module,0);
          }
        }
      ]
    });
    actionSheet.present();
  }

  enquiryApproval(id, name, status)
  {
    console.log(id)
    console.log(status)

    if(name=='Banquet Hall')
    {
      this.type='finalize_hall_enquiry';
    }
    else if(name=='Car Rental')
    {
      this.type='finalize_car_enquiry';
    }
    else if(name=='Caterer')
    {
      this.type='finalize_caterer_enquiry';
    }

    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.authService.getData(this.type+'?id='+id+'&status='+status,this.token).then((result) => {
      this.responseData = result;
        console.log(this.responseData)
        if(this.responseData.status==true)
        {
          this.getEnquiries(this.lastClicked);
        }
        loader.dismiss();

    }, (err) => {
      loader.dismiss();
      console.log(err)
      this.message="Oops! Something went wrong.";
    });

  }
  
  onOpenMenu(){
    this.menuCtrl.open();
  }

  goToEnquiryDetails(details: any){
    console.log(details);
    this.navCtrl.push(EnquiryDetailsPage,details);

  }
  
}
