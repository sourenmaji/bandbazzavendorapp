import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnquiriesPage } from './enquiries';

@NgModule({
  declarations: [
    EnquiriesPage,
  ],
  imports: [
    IonicPageModule.forChild(EnquiriesPage),
  ],
  exports: [
    EnquiriesPage
  ]
})
export class EnquiriesPageModule {}
