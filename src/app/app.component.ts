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
import { LocalNotifications } from '../../node_modules/@ionic-native/local-notifications';


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
    public alertCtrl: AlertController, public fcm: FCM,private local: LocalNotifications) {

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.

        statusBar.styleDefault();
        splashScreen.hide();
        fcm.getToken().then(device_token => {
          if(!localStorage.getItem('device_token') || (device_token != localStorage.getItem('device_token')))
          {
            alert("New token/refreshed token");
            localStorage.setItem('device_token', device_token)
          }
        }, (err) => {
          alert(err);
        });

        fcm.onNotification().subscribe(data => {
          this.scheduleNotification(data);
          alert(JSON.stringify(data));
          if(data.wasTapped){
            alert("Received in background");
            if(data.type == 'Enquiry')
            {
              this.nav.push(EnquiriesPage, data);
            }
            else if(data.type == 'Approval')
            {
              this.nav.push(ProductsPage, data);
            }
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


    scheduleNotification(data)
    {
      alert("stringified:"+JSON.stringify(data));

      this.local.schedule({
        title:data.title,
        text:data.body,
        trigger: {at: new Date(new Date().getTime() + 3600)},
        icon:data.icon
      });
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

