import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { WelcomePage } from '../pages/welcome/welcome';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { BusinessPage } from '../pages/business/business';
import { ProductsPage } from '../pages/products/products';
import { EnquiriesPage } from '../pages/enquiries/enquiries';
import { BookingsPage } from '../pages/bookings/bookings';
import { CustomPackageEnquiriesPage } from '../pages/custom-package-enquiries/custom-package-enquiries';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { AddCatererPage } from '../pages/add-caterer/add-caterer';
import { AddCarsPage } from '../pages/add-cars/add-cars';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
 rootPage:any = WelcomePage;//modified by krishna, line 23 should be reverted back to --> rootPage:any = WelcomePage;
  // rootPage:any = AddCatererPage;
  dashboardPage = DashboardPage;
  profilePage = ProfilePage;
  homePage = HomePage;
  businessPage = BusinessPage;
  productsPage = ProductsPage;
  enquiriesPage = EnquiriesPage;
  bookingsPage = BookingsPage;
  customPackageEnquiriesPage = AddCarsPage;


  userDetails : any;
  responseData: any;

  userPostData = {"user":"","token":""};
  @ViewChild('nav') nav: NavController;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private menuCtrl: MenuController,public authService:AuthServiceProvider,
               public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // const data = JSON.parse(localStorage.getItem('userData'));
    // this.userDetails = data.success.user;

    // this.userPostData.user = this.userDetails;
    // this.userPostData.token = data.success.token;
    // console.log(this.userPostData.token);
    // console.log( this.userPostData.user);
  }
  onload(page: any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
   }

   backToWelcome(){
      this.nav.push(WelcomePage);
      this.menuCtrl.close();
    }

    onLogout()
      {
        localStorage.clear();
        setTimeout(() => this.backToWelcome(), 1000);
      }


  // openBusiness(){
  //       const data = JSON.parse(localStorage.getItem('userData'));
  //       this.userDetails = data.success.user;

  //       this.userPostData.user = this.userDetails;
  //       this.userPostData.token = data.success.token;

  //       console.log(this.userPostData.token);
  //       console.log( this.userPostData.user);

  //       this.authService.getData('get_all_business',this.userPostData.token).then((result) => {
  //        this.responseData = result;


  //        if(this.responseData.status == true)
  //        {
  //        console.log(this.responseData);
  //        localStorage.setItem('businessData', JSON.stringify(this.responseData.businesses));
  //        console.log("Local storage "+JSON.parse(localStorage.getItem('businessData')));

  //        }
  //        else{
  //         const alert = this.alertCtrl.create({
  //           subTitle: this.responseData.message,
  //           buttons: ['OK']
  //         })
  //         alert.present();
  //       }
  //      },
  //      (err) => {
  //       this.responseData = err.json();
  //       console.log(this.responseData)
  //      });
  //      this.nav.push(BusinessPage);
  //      this.menuCtrl.close();
  //     }

}

