
import { Component, ViewChild } from '@angular/core';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AlertController, Events, MenuController, Platform, NavController } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { NetworkProvider } from './../providers/network-provider/network_provider';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild('nav') navCtrl: NavController;
  
  rootPage: any;
  pages: any;
  isActive: any;
  userDetails : any;
  responseData: any;
  loggedIn: any;
  
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    public authService:AuthServiceProvider,
    public events: Events,
    public network: Network,
    public networkProvider: NetworkProvider,
    public alertCtrl: AlertController,
    public fcm: FCM
    )
    {
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleBlackTranslucent();
        splashScreen.hide();
        
        this.fcm.getToken().then(device_token => {
          console.log('got token');
          localStorage.setItem('device_token',JSON.stringify(device_token));
          console.log(device_token);
        },
        (err) => {
          console.log(err);
        });
        
        this.fcm.onNotification().subscribe(data => {
          if(data.wasTapped){
            console.log("Received in background");
            this.goToPage(data);
          } else {
            console.log("Received in foreground");
            if(data.category) {
            this.scheduleNotification(data);
            }
          };
        });
        
        this.fcm.onTokenRefresh().subscribe(refresh_token => {
          console.log('refresh token');
          localStorage.setItem('device_token', refresh_token);
        },
        (err) => {
          console.log(err);
        });
        
        this.networkProvider.initializeNetworkEvents();
        this.networkProvider.getNetworkState();
        
        // Offline event
        this.events.subscribe('network:offline',() => {
          this.navCtrl.push('ErrorPage');
        });
        
        // Online event
        this.events.subscribe('network:online',() => {
          this.navCtrl.pop();
        });
        
        this.pages=[
          {title: 'Dashboard', component: 'DashboardPage', icon: 'easel', color: 'dash1'},
          {title: 'Profile', component: 'ProfilePage', icon: 'person', color: 'dash2'},
          {title: 'Settings', component: 'SettingsPage', icon: 'settings', color: 'lightprimary'},
          {title: 'Business', component: 'BusinessPage', icon: 'stats', color: 'dash8'},
          {title: 'Products', component: 'ProductsPage', icon: 'basket', color: 'energy'},
          {title: 'Enquiries', component: 'EnquiriesPage', icon: 'mic', color: 'dash6'},
          {title: 'Bookings', component: 'BookingsPage', icon: 'albums', color: 'dark'},
        ]
        
        this.loggedIn = JSON.parse(localStorage.getItem('userData'));
        console.log("User logged in", this.loggedIn);
        this.isActive=this.pages[0];
        
        if(this.loggedIn)
        {
          this.navCtrl.setRoot('DashboardPage');
        }
        else
        {
          this.navCtrl.setRoot('WelcomePage');
        }
      });
    }
    
    goToPage(data)
    {
      if(data.category == 'Enquiry')
      {
        this.navCtrl.setRoot('EnquiriesPage',{category: data.subcategory, filter: data.type});
        //alert("trying to open approval");
      }
      else if(data.category == 'Product')
      {
        this.navCtrl.setRoot('ProductsPage',{category: data.subcategory});
        //alert("trying to open products");
      }
      else if(data.category == 'Booking')
      {
        this.navCtrl.setRoot('BookingsPage',{category: data.subcategory, filter: data.type});
        //alert("trying to open bookings");
      }
      else if(data.category == 'Business')
      {
        this.navCtrl.setRoot('BusinessPage');
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
    
    onload(page: any)
    {
      this.navCtrl.setRoot(page.component);
      this.isActive=page;
      this.menuCtrl.close();
    }
    
    backToWelcome()
    {
      this.navCtrl.push('WelcomePage');
      this.menuCtrl.close();
    }
    
    checkActive(page)
    {
      return page==this.isActive;
    }
  }
  
