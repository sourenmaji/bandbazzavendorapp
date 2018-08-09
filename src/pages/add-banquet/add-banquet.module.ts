import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBanquetPage } from './add-banquet';
import { AgmCoreModule } from '../../../node_modules/@agm/core';

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
})
export class AddBanquetPageModule {}
