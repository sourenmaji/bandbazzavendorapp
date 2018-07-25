import { Component } from '@angular/core';
import { IonicPage, MenuController, LoadingController, ActionSheetController, AlertController, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-enquiry-details',
  templateUrl: 'enquiry-details.html',
})
export class EnquiryDetailsPage {
  
  responseData: any;
  token: any;
  type: string;
  message: string;
  enquiry: any;
  apiUrl = 'http://192.168.0.130/BandBazza/public/';
  
  constructor(private navParams: NavParams, private menuCtrl: MenuController, private navCtrl: NavController, private authService: AuthServiceProvider, private loadingCtrl: LoadingController, private actionCtrl: ActionSheetController, private toastCtrl: ToastController) {
    this.responseData = {};
    this.authService.pageReset=false;
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
    this.enquiry = this.navParams.data;
    this.message="";
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EnquiryDetailsPage');
  }
  ionViewDidEnter()
  {
    
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
    //status is 1 for approve, 0 for decline  
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

    //create toast notification
    let toast = this.toastCtrl.create({
      message: "",
      duration: 2000,
      position: 'top'
    });
  
    
    loader.present();
    this.authService.getData(this.type+'?id='+id+'&status='+status,this.token).then((result) => {
      this.responseData = result;
      console.log(this.responseData)
      if(this.responseData.status)
      {
        loader.dismiss();
        let action="declined";
        if(status)
        action="approved";
        this.message="You have successfully "+action+" an enquiry";
        toast.setMessage(this.message);
        toast.present();
        console.log(this.message);
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
          this.authService.pageReset=true;
          this.navCtrl.pop();
        });
       
      }
    },
    (err) => {
      loader.dismiss();
      console.log(err)
      this.message="Oops! Something went wrong.";
      toast.setMessage(this.message);
      toast.present();
    });
    
  }
}
