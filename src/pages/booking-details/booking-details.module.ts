import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingDetailsPage } from './booking-details';

@NgModule({
  declarations: [
    BookingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingDetailsPage),
  ],
  exports: [
    BookingDetailsPage
  ]
})
export class BookingDetailsPageModule {}
