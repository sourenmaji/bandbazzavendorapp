import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AddbusinessPage } from '../addbusiness/addbusiness';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-business',
  templateUrl: 'business.html',
})
export class BusinessPage {
  businessDetails : any;
  userDetails : any;
  responseData: any;
  userPostData = {"user":"","token":""};

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController,
              public authService: AuthServiceProvider, private alertCtrl: AlertController) {
    const data = JSON.parse(localStorage.getItem('businessData'));
    this.businessDetails = data;
    

  }
  onOpenMenu(){
this.menuCtrl.open();
  }
  


  addBusiness(){
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
    
    console.log(this.userPostData.token);
    console.log( this.userPostData.user);

    this.authService.getData('check_businesses',this.userPostData.token).then((result) => {
     this.responseData = result;
     
     
     if(this.responseData.status == true)
     {
     console.log(this.responseData.data.options);
     localStorage.setItem('businessOptions', JSON.stringify(this.responseData.data));
     console.log("Local storage "+JSON.parse(localStorage.getItem('businessOptions')));
     
     }
     else{
      const alert = this.alertCtrl.create({
        subTitle: this.responseData.message,
        buttons: ['OK']
      })
      alert.present();
    }
   }, 
   (err) => {
    this.responseData = err.json();
    console.log(this.responseData)
   });
   this.navCtrl.push(AddbusinessPage);
  }


}
