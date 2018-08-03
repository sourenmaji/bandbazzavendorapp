import { ViewProductCarPage } from './../pages/view-product-car/view-product-car';
import { ViewProductCatererPage } from './../pages/view-product-caterer/view-product-caterer';
import { ViewProductBanquatePage } from './../pages/view-product-banquate/view-product-banquate';
import { EditbusinessPage } from './../pages/editbusiness/editbusiness';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpModule } from '@angular/http';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ProfilePage } from '../pages/profile/profile';
import { BusinessPage } from '../pages/business/business';
import { ProductsPage } from '../pages/products/products';
import { EnquiriesPage } from '../pages/enquiries/enquiries';
import { BookingsPage } from '../pages/bookings/bookings';
import { CustomPackageEnquiriesPage } from '../pages/custom-package-enquiries/custom-package-enquiries';
import { Network} from '@ionic-native/network';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { AddbusinessPage } from '../pages/addbusiness/addbusiness';
import { AddCatererPage } from '../pages/add-caterer/add-caterer';
import { EnquiryDetailsPage } from '../pages/enquiry-details/enquiry-details';
import { BookingDetailsPage } from '../pages/booking-details/booking-details';
import { AddCarsPage } from '../pages/add-cars/add-cars';
import { HttpClient, HttpClientModule } from '../../node_modules/@angular/common/http';
import { AddBanquetPage } from '../pages/add-banquet/add-banquet';
import { AgmCoreModule } from '@agm/core';
import { ImagePicker } from '../../node_modules/@ionic-native/image-picker';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WelcomePage,
    LoginPage,
    RegisterPage,
    ForgetPasswordPage,
    DashboardPage,
    ProfilePage,
    BusinessPage,
    ProductsPage,
    EnquiriesPage,
    EnquiryDetailsPage,
    BookingsPage,
    BookingDetailsPage,
    CustomPackageEnquiriesPage,
    EditProfilePage,
    AddbusinessPage,
    EditbusinessPage,
    ViewProductBanquatePage,
    ViewProductCatererPage,
    ViewProductCarPage,
    AddCatererPage,
    AddCarsPage,
    AddBanquetPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBzeppyrAzDcifb1vGnNArdBuZp5X39s-Y",
      libraries: ["places"]
  })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WelcomePage,
    LoginPage,
    RegisterPage,
    ForgetPasswordPage,
    DashboardPage,
    ProfilePage,
    BusinessPage,
    ProductsPage,
    EnquiriesPage,
    EnquiryDetailsPage,
    BookingsPage,
    BookingDetailsPage,
    CustomPackageEnquiriesPage,
    EditProfilePage,
    AddbusinessPage,
    EditbusinessPage,
    ViewProductBanquatePage,
    ViewProductCatererPage,
    ViewProductCarPage,
    AddCatererPage,
    AddCarsPage,
    AddBanquetPage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    ImagePicker,
    Network,
    File,
    FileTransfer,
    Camera,
    FilePath
  ]
})
export class AppModule {}
