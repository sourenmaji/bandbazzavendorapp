import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FCM } from '@ionic-native/fcm';
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
import { NetworkProvider } from './../providers/network-provider/network_provider';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
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
    FCM,
    Base64,
    Facebook,
    GooglePlus
  ]
})
export class AppModule {}
