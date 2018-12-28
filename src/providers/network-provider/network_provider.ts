import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { AlertController, Events } from 'ionic-angular';

export enum ConnectionStatusEnum {
    Online,
    Offline
}
@Injectable()
export class NetworkProvider {

  previousStatus;
networkState : boolean = true;

  constructor(public alertCtrl: AlertController,
              public network: Network,
              public eventCtrl: Events) {

    console.log('Hello NetworkProvider Provider');

    this.previousStatus = ConnectionStatusEnum.Online;

  }

    public initializeNetworkEvents() {

        if(this.network.type === 'none'){
            // alert("You are Ofline");
            this.networkState = false;

        }
        this.network.onDisconnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Online) {
               // alert("ondisconect");
                this.eventCtrl.publish('network:offline');
            }
            this.previousStatus = ConnectionStatusEnum.Offline;
        });
        this.network.onConnect().subscribe(() => {
           // alert("onconect");
            if (this.previousStatus === ConnectionStatusEnum.Offline) {
                this.eventCtrl.publish('network:online');
            }
            this.previousStatus = ConnectionStatusEnum.Online;
        });
    }

    public getNetworkState(): string{
        return this.network.type;

    }



}
