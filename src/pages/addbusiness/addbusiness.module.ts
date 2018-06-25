import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddbusinessPage } from './addbusiness';

@NgModule({
  declarations: [
    AddbusinessPage,
  ],
  imports: [
    IonicPageModule.forChild(AddbusinessPage),
  ],
})
export class AddbusinessPageModule {}
