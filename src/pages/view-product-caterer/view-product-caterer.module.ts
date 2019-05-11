import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProductCatererPage } from './view-product-caterer';

@NgModule({
  declarations: [
    ViewProductCatererPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewProductCatererPage),
  ],
  exports: [
    ViewProductCatererPage
  ]
})
export class ViewProductCatererPageModule {}
