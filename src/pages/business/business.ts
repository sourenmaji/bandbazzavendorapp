import { EditbusinessPage } from './../editbusiness/editbusiness';
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
    // const data = JSON.parse(localStorage.getItem('businessData'));
    // console.log(data);
     this.businessDetails = [];
     const data = JSON.parse(localStorage.getItem('userData'));
     this.userDetails = data.success.user;
 
     this.userPostData.user = this.userDetails;
     this.userPostData.token = data.success.token;

  }
 

  ionViewWillEnter(){
   
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.success.user;
  
      this.userPostData.user = this.userDetails;
      this.userPostData.token = data.success.token;
      
      console.log(this.userPostData.token);
      console.log( this.userPostData.user);

     this.openBusiness();
    
  } 


  openBusiness(){
    this.authService.getData('get_all_business',this.userPostData.token).then((result) => {
      this.responseData = result;
      
      
      if(this.responseData.status == true)
      {
      console.log(this.responseData.businesses);
     //  localStorage.setItem('businessData', JSON.stringify(this.responseData.businesses));
     //  console.log("Local storage "+JSON.parse(localStorage.getItem('businessData')));

      const value = this.responseData.businesses;
      this.businessDetails = value;
     
      }
      else{
       const alert = this.alertCtrl.create({
         subTitle: this.responseData.message,
         buttons: ['OK']
       })
       alert.present();
       this.businessDetails = [];
     }
    }, 
    (err) => {
     this.responseData = err.json();
     console.log(this.responseData)
    });
   // this.nav.push(BusinessPage);
    this.menuCtrl.close();

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
   //this.navCtrl.remove(this.navCtrl.length()-1);
   
  }


  editBusiness(business){
    console.log(business);
    this.navCtrl.push(EditbusinessPage,{business: business});
  }

  deactiveBusiness(businessid){
    console.log(businessid);
    this.authService.getData('deactivate_business?business_id='+businessid,this.userPostData.token).then((result) => {
      this.responseData = result;
      
      
      if(this.responseData.status == true)
      {
    
        const alert = this.alertCtrl.create({
          subTitle: this.responseData.message,
          buttons: ['OK']
        })
        alert.present();
        this.openBusiness();
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
     const alert = this.alertCtrl.create({
      subTitle: this.responseData.message,
      buttons: ['OK']
    })
    alert.present();
    });
 
  }


  deleteBusiness(businessid){
    console.log(businessid);
    this.authService.getData('delete_business?business_id='+businessid,this.userPostData.token).then((result) => {
      this.responseData = result;
      
      
      if(this.responseData.status == true)
      {
    
        const alert = this.alertCtrl.create({
          subTitle: this.responseData.message,
          buttons: [{
            text: 'Ok',
          handler: () => {
            
            let navTransition = alert.dismiss();

              navTransition.then(() => {
                this.openBusiness();
              });

            return false;
          }
        }]
        });
        alert.present();
        
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
     const alert = this.alertCtrl.create({
      subTitle: this.responseData.message,
      buttons: ['OK']
    })
    alert.present();
    });
  
  }

  onOpenMenu(){
    this.menuCtrl.open();
   }
}
