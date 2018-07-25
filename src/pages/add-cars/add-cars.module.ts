import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCarsPage } from './add-cars';

@NgModule({
  declarations: [
    AddCarsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCarsPage),
  ],
})
export class AddCarsPageModule {}
