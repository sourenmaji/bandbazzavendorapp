
import { NetworkProvider } from './../providers/network-provider/network_provider';
import { Network } from '@ionic-native/network';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, App, AlertController, Events } from 'ionic-angular';
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
import { ErrorPage } from '../pages/error/error';
//import { LocalNotifications } from '../../node_modules/@ionic-native/local-notifications';


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

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private menuCtrl: MenuController,public authService:AuthServiceProvider,
    public events: Events,
    public network: Network,
    public networkProvider: NetworkProvider,
    public alertCtrl: AlertController,
    public fcm: FCM) {

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.

        statusBar.styleDefault();
        splashScreen.hide();
        fcm.getToken().then(device_token => {
            localStorage.setItem('device_token', device_token)
        }, (err) => {
          console.log(err);
        });

        fcm.onNotification().subscribe(data => {
          if(data.wasTapped){
            //alert("Received in background");
            this.goToPage(data);
          }
          else
          {
            this.scheduleNotification(data);
            //alert("Received in foreground");
          };
        });

        fcm.onTokenRefresh().subscribe(refresh_token => {
          localStorage.setItem('device_token', refresh_token);
        }, (err) => {
          console.log(err);
        });

        this.networkProvider.initializeNetworkEvents();

        // Offline event
        this.events.subscribe('network:offline', () => {
          console.log('network:offline ==> '+this.network.type);
          this.nav.push(ErrorPage);
        });

        // Online event
        this.events.subscribe('network:online', () => {
          console.log('network:online ==> '+this.network.type);
          this.nav.push(WelcomePage);
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


    goToPage(data)
    {
      if(data.category == 'Enquiry')
      {
        this.nav.setRoot(EnquiriesPage,{category: data.subcategory, filter: data.type});
        //alert("trying to open approval");
      }
      else if(data.category == 'Product')
      {
        this.nav.setRoot(ProductsPage,{category: data.subcategory});
        //alert("trying to open products");
      }
      else if(data.category == 'Booking')
      {
        this.nav.setRoot(BookingsPage,{category: data.subcategory, filter: data.type});
        //alert("trying to open bookings");
      }
      else if(data.category == 'Business')
      {
        this.nav.setRoot(BusinessPage);
        //alert("trying to open business");
      }
    }
    scheduleNotification(data)
    {
      // this.local.schedule({
      //   title: data.title,
      //   text: data.push,
      //   sound: data.sound,
      //   trigger: {at: new Date(new Date().getTime() + 100)},
      //   icon:data.icon
      // });
      let alert = this.alertCtrl.create({
        title: data.title,
        message: data.push,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Go to '+data.category+' page',
            handler: () => {
              console.log('redirecting to page');
              this.goToPage(data);
            }
          }
        ]
      });
      alert.present();
    }

    onload(page: any){
      this.nav.setRoot(page);
      this.menuCtrl.close();
    }

    backToWelcome(){
      this.nav.push(WelcomePage);
      this.menuCtrl.close();
    }

    // onLogout()
    // {
    //   localStorage.clear();
    //   setTimeout(() => this.nav.push(WelcomePage), 1000);
    // }
  }

