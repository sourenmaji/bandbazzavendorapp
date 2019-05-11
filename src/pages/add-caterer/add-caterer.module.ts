import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCatererPage } from './add-caterer';

@NgModule({
  declarations: [
    AddCatererPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCatererPage),
  ],
  exports: [
    AddCatererPage
  ]
})
export class AddCatererPageModule {}
