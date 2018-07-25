import { ViewProductCatererPage } from './../view-product-caterer/view-product-caterer';
import { ViewProductCarPage } from './../view-product-car/view-product-car';
import { ViewProductBanquatePage } from './../view-product-banquate/view-product-banquate';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { AddCatererPage } from '../add-caterer/add-caterer';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';



@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  userPostData = {"user":"","token":""};
  userDetails : any;
  responseData: any;
  categories: any;
  category: string;
  token: any;
  type: string;
  alProducts: any;
  businessProducts: any;
  message: string;
  productDetails: any;
  productImages: any;
  pageReset: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController,
              public loadingCtrl: LoadingController, public authService: AuthServiceProvider, public alertCtrl: AlertController) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;
    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
    this.responseData = {};
    this.pageReset = this.authService.pageReset;
  }

  ionViewDidLoad(){

    // this.restServ.testCall().then((result) =>
    // {
    //   this.data = result;
    //   console.log(this.data.test);
    // }
  //);

    this.categories= [];
    this.category = "";
    this.alProducts = [];
    this.businessProducts = "";
    this.message="";
    this.productDetails = "";
    this.productImages = [];
    this.getBusinessCatagories();
  }
  ionViewDidEnter(){
    
    //console.log(this.pageReset);
    if(this.pageReset){
      this.getBusinessCatagories();
    }
    
  }

  getBusinessCatagories()
  {
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.authService.getData('get_added_business',this.userPostData.token).then((result) => {
          this.responseData = result;
            console.log(this.responseData);
            this.categories=this.responseData.categories;
            if(this.categories.length){
             this.category=this.categories[0].module_name;
             //console.log(this.categories)
             loader.dismiss();
             this.getProducts(this.categories[0]);
            }else{
              const alert = this.alertCtrl.create({
                subTitle: 'No Business Added Yet',
                buttons: ['OK']
              })
              alert.present();
              loader.dismiss();
            }
            
            

        }, (err) => {
          loader.dismiss();
          console.log(err)
        });
  }


  getProducts(c: any)
  { 
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.category=c.module_name;
    this.alProducts = [];
    this.businessProducts = "";
    this.message="";
    console.log(this.category);
    if(this.category=='Banquet Hall')
    {
      this.type="get_hall_products";
    }
    else if(this.category=='Car Rental')
    {
      this.type="get_car_products";
    }
    else if(this.category=='Caterer')
    {
      this.type="get_caterer_products";
    }
    console.log(this.type)
    this.authService.getData(this.type+'?id='+c.id,this.userPostData.token).then((result) => {
      this.responseData = result;
        console.log(this.responseData)
        
           this.alProducts=this.responseData.all_products;
           this.businessProducts=this.responseData.business_details;
           console.log(this.businessProducts.module_name == 'Banquet Hall');
           if(!this.alProducts.length){
            const alert = this.alertCtrl.create({
              subTitle: 'No Product Added Yet',
              buttons: ['OK']
            })
            alert.present();
           }
        
        loader.dismiss();

    }, (err) => {
      loader.dismiss();
      console.log(err)
      this.message="Oops! Something went wrong.";

    });
  }

  detailsProduct(productId,type){
    var requestType = type;
    var cate = this.category;
    this.authService.getData('get_product_details?product_id='+productId+'&module_name='+cate,this.userPostData.token).then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      this.productDetails = this.responseData;
      if(cate=='Banquet Hall')
    {
      this.navCtrl.push(ViewProductBanquatePage,{productDetails: this.productDetails, requestType: requestType});
    }
    else if(cate=='Car Rental')
    {
      this.navCtrl.push(ViewProductCarPage,{productDetails: this.productDetails, requestType: requestType});
    }
    else if(cate=='Caterer')
    {
      this.navCtrl.push(ViewProductCatererPage,{productDetails: this.productDetails, requestType: requestType});
    }
        
    }, 
    (err) => {
     this.responseData = err.json();
     const alert = this.alertCtrl.create({
      subTitle: this.responseData.message,
      buttons: ['OK']
    })
    alert.present();
    });
 
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

}
