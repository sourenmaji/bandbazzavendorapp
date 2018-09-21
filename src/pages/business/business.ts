import { EditbusinessPage } from './../editbusiness/editbusiness';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, Platform, LoadingController } from 'ionic-angular';
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
  imageUrl: string ='';
  userPostData = {"user":"","token":""};
  no_data: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController,
              public authService: AuthServiceProvider, private alertCtrl: AlertController, public platform: Platform,
              public loadingCtrl: LoadingController) {

     this.businessDetails = [];
     const data = JSON.parse(localStorage.getItem('userData'));
     this.userDetails = data.success.user;
     this.imageUrl= this.authService.imageUrl;

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
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.authService.getData('get_all_business',this.userPostData.token).then((result) => {
      loader.dismiss();
      this.responseData = result;


      if(this.responseData.status == true)
      {
      console.log(this.responseData.businesses);

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
       this.no_data=true;
     }
    },
    (err) => {
      loader.dismiss();
     this.responseData = err.json();
     console.log(this.responseData)
    });
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

   let alert = this.alertCtrl.create({
    title: 'Confirm',
    message: 'Do you want to deactivate?',
    buttons: [{
      text: "deactivate",
      handler: () => {
         //create loader
        let loader = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loader.present();

        this.authService.getData('deactivate_business?business_id='+businessid,this.userPostData.token).then((result) => {
          loader.dismiss();
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
          loader.dismiss();
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
        //create loader
        let loader = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loader.present();

         this.authService.getData('reactivate_business?business_id='+businessid,this.userPostData.token).then((result) => {
          loader.dismiss();
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
           loader.dismiss();
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

    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete?',
      buttons: [{
        text: "ok",
        handler: () => {
          //create loader
          let loader = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loader.present();

          this.authService.getData('delete_business?business_id='+businessid,this.userPostData.token).then((result) => {
          this.responseData = result;
            loader.dismiss();

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
          loader.dismiss();
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
