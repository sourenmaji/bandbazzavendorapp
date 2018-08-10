import { EditbusinessPage } from './../editbusiness/editbusiness';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, Platform } from 'ionic-angular';
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
              public authService: AuthServiceProvider, private alertCtrl: AlertController, public platform: Platform) {
    // const data = JSON.parse(localStorage.getItem('businessData'));
    // console.log(data);
     this.businessDetails = [];
     const data = JSON.parse(localStorage.getItem('userData'));
     this.userDetails = data.success.user;
 
     this.userPostData.user = this.userDetails;
     this.userPostData.token = data.success.token;

     let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)

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
     console.log(this.responseData.data);
    //  localStorage.setItem('businessOptions', JSON.stringify(this.responseData.data));
    //  console.log("Local storage "+JSON.parse(localStorage.getItem('businessOptions')));
     this.navCtrl.push(AddbusinessPage,this.responseData.data);
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
  }


  editBusiness(business){
    console.log(business);
    this.navCtrl.push(EditbusinessPage,{business: business});
  }

  deactiveBusiness(businessid){
   // console.log(businessid);

   let alert = this.alertCtrl.create({
    title: 'Confirm',
    message: 'Do you want to deactivate?',
    buttons: [{
      text: "deactivate",
      handler: () => { 

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
    }, {
      text: "Cancel",
      role: 'cancel'
    }]
  })
  alert.present();
  }

  reactiveBusiness(businessid){

    let alert = this.alertCtrl.create({
     title: 'Confirm',
     message: 'Do you want to reactivate your business?',
     buttons: [{
       text: "Reactivate",
       handler: () => { 
 
         this.authService.getData('reactivate_business?business_id='+businessid,this.userPostData.token).then((result) => {
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
     }, {
       text: "Cancel",
       role: 'cancel'
     }]
   })
   alert.present();
   }


  deleteBusiness(businessid){
    //console.log(businessid);

    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete?',
      buttons: [{
        text: "ok",
        handler: () => { this.authService.getData('delete_business?business_id='+businessid,this.userPostData.token).then((result) => {
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
      }, {
        text: "Cancel",
        role: 'cancel'
      }]
    })
    alert.present();

  
  }

  onOpenMenu(){
    this.menuCtrl.open();
   }
}
