import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBanquetPage } from './add-banquet';

@NgModule({
  declarations: [
    AddBanquetPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBanquetPage),
  ],
})
export class AddBanquetPageModule {}
