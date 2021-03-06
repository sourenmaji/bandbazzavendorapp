import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, LoadingController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
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
  imageUrl: string = '';
  constructor(public platform: Platform,private navParams: NavParams, private navCtrl: NavController, private authService: AuthServiceProvider, private loadingCtrl: LoadingController, private actionCtrl: ActionSheetController, private toastCtrl: ToastController) {
    this.responseData = {};
    this.authService.pageReset=false;
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.token;
    this.enquiry = this.navParams.data;
    console.log('enquiry', this.enquiry);
    this.message="";
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }

  ionViewDidLoad() {
    this.imageUrl=this.authService.imageUrl;
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
    if(name==2)
    {
      this.type='finalize_hall_enquiry';
    }
    else if(name==3)
    {
      this.type='finalize_car_enquiry';
    }
    else if(name==4)
    {
      this.type='finalize_caterer_enquiry';
    }
    else if(name==5)
    {
      this.type='finalize_photography_enquiry';
    }
    else if(name==6)
    {
      this.type='finalize_makeup_enquiry';
    }

    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    //create toast notification
    let toast = this.toastCtrl.create({
      message: "",
      duration: 5000,
      position: 'bottom'
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
          console.log('Dismissed toast');
          this.authService.pageReset=true;
          this.navCtrl.pop();
      }
    },
    (err) => {
      loader.dismiss();
      console.log(err)
      this.message="Oops! something went wrong.";
      toast.setMessage(this.message);
      toast.present();
    });

  }
}
