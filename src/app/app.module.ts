import { ErrorPageModule } from './../pages/error/error.module';
import { NetworkProvider } from './../providers/network-provider/network_provider';
// import { ViewProductCarPage } from './../pages/view-product-car/view-product-car';
// import { ViewProductCatererPage } from './../pages/view-product-caterer/view-product-caterer';
// import { ViewProductBanquatePage } from './../pages/view-product-banquate/view-product-banquate';
// import { EditbusinessPage } from './../pages/editbusiness/editbusiness';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
// import { WelcomePage } from '../pages/welcome/welcome';
// import { LoginPage } from '../pages/login/login';
// import { RegisterPage } from '../pages/register/register';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpModule } from '@angular/http';
// import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
// import { DashboardPage } from '../pages/dashboard/dashboard';
// import { ProfilePage } from '../pages/profile/profile';
// import { BusinessPage } from '../pages/business/business';
// import { ProductsPage } from '../pages/products/products';
// import { EnquiriesPage } from '../pages/enquiries/enquiries';
// import { BookingsPage } from '../pages/bookings/bookings';
// import { CustomPackageEnquiriesPage } from '../pages/custom-package-enquiries/custom-package-enquiries';
import { Network} from '@ionic-native/network';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { ImagePicker } from '../../node_modules/@ionic-native/image-picker';
import { FCM } from '@ionic-native/fcm';

import { AddBanquetPageModule } from '../pages/add-banquet/add-banquet.module';
import { AddCarsPageModule } from '../pages/add-cars/add-cars.module';
import { AddCatererPageModule } from '../pages/add-caterer/add-caterer.module';
import { ViewProductCarPageModule } from '../pages/view-product-car/view-product-car.module';
import { ViewProductCatererPageModule } from '../pages/view-product-caterer/view-product-caterer.module';
import { ViewProductBanquatePageModule } from '../pages/view-product-banquate/view-product-banquate.module';
import { EditbusinessPageModule } from '../pages/editbusiness/editbusiness.module';
import { AddbusinessPageModule } from '../pages/addbusiness/addbusiness.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { CustomPackageEnquiriesPageModule } from '../pages/custom-package-enquiries/custom-package-enquiries.module';
import { BookingDetailsPageModule } from '../pages/booking-details/booking-details.module';
import { BookingsPageModule } from '../pages/bookings/bookings.module';
import { EnquiryDetailsPageModule } from '../pages/enquiry-details/enquiry-details.module';
import { EnquiriesPageModule } from '../pages/enquiries/enquiries.module';
import { ProductsPageModule } from '../pages/products/products.module';
import { BusinessPageModule } from '../pages/business/business.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { ForgetPasswordPageModule } from '../pages/forget-password/forget-password.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { LoginPageModule } from '../pages/login/login.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';


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
    CustomPackageEnquiriesPageModule,
    EditProfilePageModule,
    AddbusinessPageModule,
    EditbusinessPageModule,
    ViewProductBanquatePageModule,
    ViewProductCatererPageModule,
    ViewProductCarPageModule,
    AddBanquetPageModule,
    AddCarsPageModule,
    AddCatererPageModule,
    ErrorPageModule
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
    Camera,
    FilePath,
    FCM
  ]
})
export class AppModule {}
