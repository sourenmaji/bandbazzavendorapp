import { ViewProductCatererPage } from './../view-product-caterer/view-product-caterer';
import { ViewProductCarPage } from './../view-product-car/view-product-car';
import { ViewProductBanquatePage } from './../view-product-banquate/view-product-banquate';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { AddCatererPage } from '../add-caterer/add-caterer';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AddCarsPage } from '../add-cars/add-cars';
import { AddBanquetPage } from '../add-banquet/add-banquet';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  lastClicked: any;
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
  imageUrl: string ='';

  pageReset: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController,
              public loadingCtrl: LoadingController, public authService: AuthServiceProvider, public alertCtrl: AlertController, platform: Platform) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;
    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
    this.responseData = {};
    this.pageReset = this.authService.pageReset;
    this.categories= [];
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
  }

  ionViewDidLoad(){
    this.category = "";
    this.alProducts = [];
    this.businessProducts = "";
    this.message="";
    this.productDetails = "";
    this.productImages = [];
    this.imageUrl= this.authService.imageUrl;
    this.getBusinessCatagories();
  }
  ionViewDidEnter(){
    if(this.authService.pageReset)
    {
      this.getProducts(this.lastClicked);
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
    this.lastClicked = c;
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

  addProduct()
  {
    console.log(this.category);
    if(this.category == 'Car Rental')
    this.navCtrl.push(AddCarsPage,this.businessProducts.id);
    else if(this.category == 'Caterer')
    this.navCtrl.push(AddCatererPage,this.businessProducts.id);
    else if(this.category == 'Banquet Hall')
    this.navCtrl.push(AddBanquetPage,this.businessProducts.id);
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



  deleteProduct(productId,type){
    //console.log(businessid);

    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete?',
      buttons: [{
        text: "ok",
        handler: () => { this.authService.getData('delete_product?product_id='+productId+'&category='+type,this.userPostData.token).then((result) => {
          this.responseData = result;


          if(this.responseData.status == true)
          {

            const alert = this.alertCtrl.create({
              subTitle: this.responseData.message,
              buttons: [{
                text: 'Ok',
              handler: () => {

                let navTransition = alert.dismiss();

                  navTransition.then(() => {
                    this.getProducts(this.lastClicked);
                  });

                return false;
              }
            }]
            });
            alert.present();

          }
          else{
           const alert = this.alertCtrl.create({
             subTitle: this.responseData.message,
             buttons: ['OK']
           })
           alert.present();
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
      }, {
        text: "Cancel",
        role: 'cancel'
      }]
    })
    alert.present();


  }

}
