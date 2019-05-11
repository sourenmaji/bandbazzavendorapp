import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPhotoPlanPage } from './add-photo-plan';

@NgModule({
  declarations: [
    AddPhotoPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPhotoPlanPage),
  ],
  exports: [
    AddPhotoPlanPage
  ]
})
export class AddPhotoPlanPageModule {}
