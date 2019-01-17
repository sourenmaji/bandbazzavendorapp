import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddOfflineBookingPage } from './add-offline-booking';

@NgModule({
  declarations: [
    AddOfflineBookingPage,
  ],
  imports: [
    IonicPageModule.forChild(AddOfflineBookingPage),
  ],
})
export class AddOfflineBookingPageModule {}
