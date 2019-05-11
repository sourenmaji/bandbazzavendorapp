import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBanquetPage } from './add-banquet';

@NgModule({
  declarations: [
    AddBanquetPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBanquetPage),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDDK5MydVx-HkNyQcPTBdDyIyrqbwVPST0",
      libraries: ["places"]
  })
  ],
  exports: [
    AddBanquetPage
  ]
})
export class AddBanquetPageModule {}
