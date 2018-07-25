import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AddCatererPage } from '../add-caterer/add-caterer';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';



@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
public data: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController, public restServ:AuthServiceProvider) {
  }
  onOpenMenu(){
this.menuCtrl.open();
  }

  goTo(productType: string)
  {
    if(productType == 'caterer')
    {
      this.navCtrl.push(AddCatererPage);
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCatererPage');

    this.restServ.testCall().then((result) =>
    {
      this.data = result;
      console.log(this.data.test);
    }
  );
  }

}
