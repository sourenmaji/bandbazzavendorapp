import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMakeupArtistPage } from './add-makeup-artist';

@NgModule({
  declarations: [
    AddMakeupArtistPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMakeupArtistPage),
  ],
  exports: [
    AddMakeupArtistPage
  ]
})
export class AddMakeupArtistPageModule {}
