import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomPackageEnquiriesPage } from './custom-package-enquiries';

@NgModule({
  declarations: [
    CustomPackageEnquiriesPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomPackageEnquiriesPage),
  ],
})
export class CustomPackageEnquiriesPageModule {}
