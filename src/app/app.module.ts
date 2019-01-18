import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
// import { FCM } from '@ionic-native/fcm';
import { Base64 } from '@ionic-native/base64';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { GooglePlus } from '@ionic-native/google-plus';
import { ImagePicker } from '@ionic-native/image-picker';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AddBanquetPageModule } from '../pages/add-banquet/add-banquet.module';
import { AddCarsPageModule } from '../pages/add-cars/add-cars.module';
import { AddCatererPageModule } from '../pages/add-caterer/add-caterer.module';
import { AddMakeupArtistPageModule } from '../pages/add-makeup-artist/add-makeup-artist.module';
import { AddMakeupPlanPageModule } from '../pages/add-makeup-plan/add-makeup-plan.module';
import { AddPhotoPlanPageModule } from '../pages/add-photo-plan/add-photo-plan.module';
import { AddPhotographyPageModule } from '../pages/add-photography/add-photography.module';
import { AddbusinessPageModule } from '../pages/addbusiness/addbusiness.module';
import { BookingDetailsPageModule } from '../pages/booking-details/booking-details.module';
import { BookingsPageModule } from '../pages/bookings/bookings.module';
import { BusinessPageModule } from '../pages/business/business.module';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { EditbusinessPageModule } from '../pages/editbusiness/editbusiness.module';
import { EnquiriesPageModule } from '../pages/enquiries/enquiries.module';
import { EnquiryDetailsPageModule } from '../pages/enquiry-details/enquiry-details.module';
import { ForgetPasswordPageModule } from '../pages/forget-password/forget-password.module';
import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { ProductsPageModule } from '../pages/products/products.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { ViewProductBanquatePageModule } from '../pages/view-product-banquate/view-product-banquate.module';
import { ViewProductCarPageModule } from '../pages/view-product-car/view-product-car.module';
import { ViewProductCatererPageModule } from '../pages/view-product-caterer/view-product-caterer.module';
import { ViewProductMakeupPageModule } from '../pages/view-product-makeup/view-product-makeup.module';
import { ViewProductPhotographyPageModule } from '../pages/view-product-photography/view-product-photography.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ErrorPageModule } from './../pages/error/error.module';
import { NetworkProvider } from './../providers/network-provider/network_provider';
import { MyApp } from './app.component';
import { AddOfflineBookingPageModule } from '../pages/add-offline-booking/add-offline-booking.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    WelcomePageModule,
    LoginPageModule,
    RegisterPageModule,
    ForgetPasswordPageModule,
    DashboardPageModule,
    ProfilePageModule,
    BusinessPageModule,
    ProductsPageModule,
    EnquiriesPageModule,
    EnquiryDetailsPageModule,
    BookingsPageModule,
    BookingDetailsPageModule,
    EditProfilePageModule,
    AddbusinessPageModule,
    EditbusinessPageModule,
    ViewProductBanquatePageModule,
    ViewProductCatererPageModule,
    ViewProductCarPageModule,
    ViewProductPhotographyPageModule,
    AddPhotoPlanPageModule,
    AddBanquetPageModule,
    AddCarsPageModule,
    AddCatererPageModule,
    AddPhotographyPageModule,
    AddMakeupArtistPageModule,
    ViewProductMakeupPageModule,
    AddMakeupPlanPageModule,
    ErrorPageModule,
    AddOfflineBookingPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    NetworkProvider,
    ImagePicker,
    Network,
    File,
    FileTransfer,
    FilePath,
    // FCM,
    Base64,
    Facebook,
    GooglePlus
  ]
})
export class AppModule {}
