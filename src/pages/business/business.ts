import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, MenuController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
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
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

      this.businessDetails = [];
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.user;
      this.imageUrl= this.authService.imageUrl;

      this.userPostData.user = this.userDetails;
      this.userPostData.token = data.token;

      let backAction =  platform.registerBackButtonAction(() => {
        this.navCtrl.pop();
        backAction();
      },2)
      this.authService.pageReset=true;
    }

    ionViewWillEnter()
    {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.user;

      this.userPostData.user = this.userDetails;
      this.userPostData.token = data.token;

      console.log(this.userPostData.token);
      console.log( this.userPostData.user);
    }

    ionViewDidEnter()
    {
      if(this.authService.pageReset)
      {
        this.openBusiness();
      }
    }

    openBusiness()
    {
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
        else
        {
          const toast = this.toastCtrl.create({
            message: this.responseData.message,
            duration: 5000,
            position: 'bottom'
          })
          toast.present();
          this.businessDetails = [];
          this.no_data=true;
        }
      },
      (err) => {
        loader.dismiss();
        this.responseData = err;
        console.log(this.responseData);
        const toast = this.toastCtrl.create({
          message: 'Oops! Something went wrong.',
          duration: 5000,
          cssClass: 'toast-danger',
          position: 'bottom'
        })
        toast.present();
      });
      this.menuCtrl.close();
    }

    addBusiness()
    {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.user;

      this.userPostData.user = this.userDetails;
      this.userPostData.token = data.token;

      console.log(this.userPostData.token);
      console.log( this.userPostData.user);

      this.authService.getData('check_businesses',this.userPostData.token).then((result) => {
        this.responseData = result;

        if(this.responseData.status == true)
        {
          console.log(this.responseData.data);
          this.navCtrl.push('AddbusinessPage',this.responseData.data);
        }
        else
        {
          const alert = this.alertCtrl.create({
            subTitle: this.responseData.message,
            buttons: ['OK']
          })
          alert.present();
        }
      },
      (err) => {
        this.responseData = err;
        console.log(this.responseData);
        const toast = this.toastCtrl.create({
          message: 'Oops! Something went wrong.',
          duration: 5000,
          position: 'bottom'
        })
        toast.present();
      });
    }

    editBusiness(business)
    {
      console.log(business);
      this.navCtrl.push('EditbusinessPage',{business: business});
    }

    deactiveBusiness(businessid)
    {
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
                let toast = this.toastCtrl.create({
                  message: this.responseData.message,
                  duration: 5000,
                  position: 'bottom'
                });
                toast.present();
                this.openBusiness();
              }
              else
              {
                let toast = this.toastCtrl.create({
                  message: this.responseData.message,
                  duration: 5000,
                  position: 'bottom'
                });
                toast.present();
              }
            },
            (err) => {
              loader.dismiss();
              this.responseData = err;
              const toast = this.toastCtrl.create({
                message: 'Oops! Something went wrong.',
                duration: 5000,
                cssClass: 'toast-danger',
                position: 'bottom'
              })
              toast.present();
            });
          }
        },
        {
          text: "Cancel",
          role: 'cancel'
        }]
      })
      alert.present();
    }

    reactiveBusiness(businessid)
    {
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
                let toast = this.toastCtrl.create({
                  message: this.responseData.message,
                  duration: 5000,
                  position: 'bottom'
                });
                toast.present();
                this.openBusiness();
              }
              else
              {
                let toast = this.toastCtrl.create({
                  message: this.responseData.message,
                  duration: 5000,
                  position: 'bottom'
                });
                toast.present();
              }
            },
            (err) => {
              loader.dismiss();
              this.responseData=err;
              const toast = this.toastCtrl.create({
                message: this.responseData.message,
                duration: 5000,
                cssClass: "toast-danger",
                position: 'bottom'
              })
              toast.present();
            });
          }
        },
        {
          text: "Cancel",
          role: 'cancel'
        }]
      })
      alert.present();
    }

    deleteBusiness(businessid)
    {
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
            let toast = this.toastCtrl.create({
              message: this.responseData.message,
              duration: 5000,
              position: 'bottom'
            });
            toast.present();
            this.openBusiness();
          }
          else
          {
            let toast = this.toastCtrl.create({
              message: this.responseData.message,
              duration: 5000,
              position: 'bottom'
            });
            toast.present();
         }
            },
            (err) => {
              loader.dismiss();
              this.responseData = err;
              const toast = this.toastCtrl.create({
                message: this.responseData.message,
                duration: 5000,
                position: 'bottom'
              })
              toast.present();
            });
          }
        }, 
        {
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
