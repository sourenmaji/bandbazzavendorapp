
import { Component, ViewChild } from '@angular/core';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AlertController, Events, MenuController, Platform, NavController } from 'ionic-angular';
import { BookingsPage } from '../pages/bookings/bookings';
import { BusinessPage } from '../pages/business/business';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { EnquiriesPage } from '../pages/enquiries/enquiries';
// import { FCM } from '@ionic-native/fcm';
import { HomePage } from '../pages/home/home';
import { ProductsPage } from '../pages/products/products';
import { ProfilePage } from '../pages/profile/profile';
import { WelcomePage } from '../pages/welcome/welcome';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { NetworkProvider } from './../providers/network-provider/network_provider';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = WelcomePage;
  dashboardPage = DashboardPage;
  profilePage = ProfilePage;
  homePage = HomePage;
  businessPage = BusinessPage;
  productsPage = ProductsPage;
  enquiriesPage = EnquiriesPage;
  bookingsPage = BookingsPage;
  userDetails : any;
  responseData: any;
  userPostData = {"user":"","token":""};

  @ViewChild('nav') nav: NavController;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    public authService:AuthServiceProvider,
    public events: Events,
    public network: Network,
    public networkProvider: NetworkProvider,
    public alertCtrl: AlertController,
    // public fcm: FCM
    ) {

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.

        statusBar.styleDefault();
        splashScreen.hide();

    //     fcm.getToken().then(device_token => {
    //         localStorage.setItem('device_token', device_token)
    //     }, (err) => {
    //       console.log(err);
    //     });

    //     fcm.onNotification().subscribe(data => {
    //       if(data.wasTapped){
    //         alert("Received in background");
    //         this.goToPage(data);
    //       }
    //       else
    //       {
    //         this.scheduleNotification(data);
    //         alert("Received in foreground");
    //       };
    //     });

    //     fcm.onTokenRefresh().subscribe(refresh_token => {
    //       localStorage.setItem('device_token', refresh_token);
    //     }, (err) => {
    //       console.log(err);
    //     });

    //     this.networkProvider.initializeNetworkEvents();
    //    this.networkProvider.getNetworkState();

    //     // Offline event
    //  this.events.subscribe('network:offline', () => {
    //      this.nav.push(ErrorPage);
    //  });

    //  // Online event
    //  this.events.subscribe('network:online', () => {
    //      this.nav.pop();
    //  });

    const data = JSON.parse(localStorage.getItem('userData'));
      if(data)
      {
        this.userPostData.user = data.user;
        this.userPostData.token = data.token;
      }
      if(this.userPostData.token)
      {
        this.nav.setRoot(DashboardPage);
      }

  });
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
  }

