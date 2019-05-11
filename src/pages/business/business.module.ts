import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessPage } from './business';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    BusinessPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessPage),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDDK5MydVx-HkNyQcPTBdDyIyrqbwVPST0",
      libraries: ["places"]
  })
  ],
  exports: [
    BusinessPage
  ]
})
export class BusinessPageModule {}
