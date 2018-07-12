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
type: string;
enquiries: any;
enquiries_history: any;
message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController, public authService: AuthServiceProvider) {
    
    console.log('here1');
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
  }

  ionViewWillEnter()
  {
    console.log('here2');
 
  }
   ionViewDidEnter()
   {
    this.categories= [];
    this.category = "";
    this.enquiries = [];
    this.enquiries_history = [];
    this.message="";
    this.getCategories();
   }

  onOpenMenu(){
    this.menuCtrl.open();
  }

  getCategories()
  {
    this.authService.getData('check_my_enquiries',this.token).then((result) => {
          this.responseData = result;
            console.log(this.responseData)
            this.categories=this.responseData.categories;
            this.category=this.categories[0].module_name;
            console.log(this.categories)
            this.getEnquiries(this.categories[0]);

        }, (err) => {
          console.log(err)
        });
  }
  
  getEnquiries(c: any)
  { 
    this.category=c.module_name;
    this.enquiries = [];
    this.enquiries_history = [];
    console.log(this.category);
    if(this.category=='Banquet Hall')
    {
      this.type="get_hall_enquiries";
    }
    else if(this.category=='Car Rental')
    {
      this.type="get_hall_enquiries";
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

    }, (err) => {
      console.log(err)
      this.message="Oops! Something went wrong.";
    });
  }

}
