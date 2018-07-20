import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnquiryDetailsPage } from './enquiry-details';

@NgModule({
  declarations: [
    EnquiryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EnquiryDetailsPage),
  ],
})
export class EnquiryDetailsPageModule {}
