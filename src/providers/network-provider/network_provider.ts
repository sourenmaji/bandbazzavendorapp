import { ErrorPage } from './../../pages/error/error';
import { Network } from '@ionic-native/network';
import { AlertController, Events, NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';

export enum ConnectionStatusEnum {
    Online,
    Offline
}
@Injectable()
export class NetworkProvider {

  previousStatus;

  constructor(public alertCtrl: AlertController, 
              public network: Network,
              public eventCtrl: Events) {

    console.log('Hello NetworkProvider Provider');

    this.previousStatus = ConnectionStatusEnum.Online;
    
  }

    public initializeNetworkEvents() {
        var networkType = this.network.type;
        //alert("oninsialize"+networkType);
        if(this.network.type === 'none'){
            alert("You are Ofline");
            //this.eventCtrl.publish('network:offline');
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