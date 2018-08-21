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
import { FCM } from '@ionic-native/fcm';


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
    public alertCtrl: AlertController, public fcm: FCM,) {

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
        fcm.getToken().then(device_token => {
          localStorage.setItem('device_token', device_token);
        }, (err) => {
          alert(err);
        });

        fcm.onNotification().subscribe(data => {
          alert(JSON.stringify(data));
          if(data.wasTapped){
            alert("Received in background");
          } else {
            alert("Received in foreground");
          };
        });

        fcm.onTokenRefresh().subscribe(refresh_token => {
          localStorage.setItem('device_token', refresh_token);
          alert('Refresh'+localStorage.getItem('device_token'));
        }, (err) => {
          alert(err);
        });

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

