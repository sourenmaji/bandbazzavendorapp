import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMakeupPlanPage } from './add-makeup-plan';

@NgModule({
  declarations: [
    AddMakeupPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMakeupPlanPage),
  ],
})
export class AddMakeupPlanPageModule {}
