import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProductPhotographyPage } from './view-product-photography';

@NgModule({
  declarations: [
    ViewProductPhotographyPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewProductPhotographyPage),
  ],
  exports: [
    ViewProductPhotographyPage
  ]
})
export class ViewProductPhotographyPageModule {}
