import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditbusinessPage } from './editbusiness';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    EditbusinessPage,
  ],
  imports: [
    IonicPageModule.forChild(EditbusinessPage),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDDK5MydVx-HkNyQcPTBdDyIyrqbwVPST0",
      libraries: ["places"]
  })
  ],
  exports: [
    EditbusinessPage
  ]
})
export class EditbusinessPageModule {}
