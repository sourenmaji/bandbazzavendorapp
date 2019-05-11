import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddbusinessPage } from './addbusiness';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AddbusinessPage,
  ],
  imports: [
    IonicPageModule.forChild(AddbusinessPage),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDDK5MydVx-HkNyQcPTBdDyIyrqbwVPST0",
      libraries: ["places"]
  })
  ],
  exports: [
    AddbusinessPage
  ]
})
export class AddbusinessPageModule {}
