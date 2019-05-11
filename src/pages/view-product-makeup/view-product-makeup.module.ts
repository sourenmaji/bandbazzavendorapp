import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProductMakeupPage } from './view-product-makeup';

@NgModule({
  declarations: [
    ViewProductMakeupPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewProductMakeupPage),
  ],
  exports: [
    ViewProductMakeupPage
  ]
})
export class ViewProductMakeupPageModule {}
