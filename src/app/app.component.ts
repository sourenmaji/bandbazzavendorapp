import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { WelcomePage } from '../pages/welcome/welcome';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { BusinessPage } from '../pages/business/business';
import { ProductsPage } from '../pages/products/products';
import { EnquiriesPage } from '../pages/enquiries/enquiries';
import { BookingsPage } from '../pages/bookings/bookings';
import { CustomPackageEnquiriesPage } from '../pages/custom-package-enquiries/custom-package-enquiries';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  dashboardPage = DashboardPage;
  profilePage = ProfilePage;
  homePage = HomePage;
  businessPage = BusinessPage;
  productsPage = ProductsPage;
  enquiriesPage = EnquiriesPage;
  bookingsPage = BookingsPage;
  customPackageEnquiriesPage = CustomPackageEnquiriesPage;
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
      
      const data = JSON.parse(localStorage.getItem('userData'));
      if(data)
      {
        this.userPostData.user = data.success.user;
        this.userPostData.token = data.success.token;
      }
      if(this.userPostData.token)
      {
        this.rootPage = DashboardPage;
      }
      else
      {
        this.rootPage = WelcomePage;
      }
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
  }
  
  