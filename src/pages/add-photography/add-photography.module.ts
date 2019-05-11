import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPhotographyPage } from './add-photography';

@NgModule({
  declarations: [
    AddPhotographyPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPhotographyPage),
  ],
  exports: [
    AddPhotographyPage
  ]
})
export class AddPhotographyPageModule {}
