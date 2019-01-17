import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, MenuController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AddBanquetPage } from '../add-banquet/add-banquet';
import { AddCarsPage } from '../add-cars/add-cars';
import { AddCatererPage } from '../add-caterer/add-caterer';
import { AddMakeupArtistPage } from '../add-makeup-artist/add-makeup-artist';
import { AddMakeupPlanPage } from '../add-makeup-plan/add-makeup-plan';
import { AddPhotoPlanPage } from '../add-photo-plan/add-photo-plan';
import { AddPhotographyPage } from '../add-photography/add-photography';
import { ViewProductMakeupPage } from '../view-product-makeup/view-product-makeup';
import { ViewProductPhotographyPage } from '../view-product-photography/view-product-photography';
import { ViewProductBanquatePage } from './../view-product-banquate/view-product-banquate';
import { ViewProductCarPage } from './../view-product-car/view-product-car';
import { ViewProductCatererPage } from './../view-product-caterer/view-product-caterer';

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
  category_name: string;
  category_id: number;
  token: any;
  type: string;
  alProducts: any;
  businessProducts: any;
  message: string;
  productDetails: any;
  productImages: any;
  imageUrl: string ='';
  no_data: boolean = false;

  pageReset: boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private menuCtrl: MenuController,
              public loadingCtrl: LoadingController,
              public authService: AuthServiceProvider,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              platform: Platform) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.user;
    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.token;
    this.responseData = {};
    this.pageReset = this.authService.pageReset;
    this.categories= [];
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2);
    this.category_name='';
    this.category_id = 0;
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
      console.log(this.lastClicked);
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
    this.authService.pageReset=false;
    this.authService.getData('get_added_business',this.userPostData.token).then((result) => {
      loader.dismiss();
          this.responseData = result;
            console.log(this.responseData);
            this.categories=this.responseData.categories;
            if(this.categories.length)
            {
             this.getProducts(this.categories[0]);
            }
            else
            {
              const toast = this.toastCtrl.create({
                message: 'No Business Added Yet',
                duration: 5000,
                position: 'bottom'
              })
              toast.present();
              this.no_data=true;
            }
        }, (err) => {
          loader.dismiss();
          const toast = this.toastCtrl.create({
            message: 'Oops! Something went wrong.',
            duration: 5000,
            cssClass: "toast-danger",
            position: 'bottom'
          })
          toast.present();
          console.log(err)
        });
  }


  getProducts(c: any)
  {
    console.log(c);
    //create loader
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.lastClicked = c;
    this.category_id=c.module_id;
    this.category_name=c.module_name;

    this.alProducts = [];
    this.businessProducts = "";
    this.message="";
    console.log(this.category_id);
    if(this.category_id==2)
    {
      this.type="get_hall_products";
    }
    else if(this.category_id==3)
    {
      this.type="get_car_products";
    }
    else if(this.category_id==4)
    {
      this.type="get_caterer_products";
    }
    else if(this.category_id==5)
    {
      this.type="get_photography_products";
    }
    else if(this.category_id==6)
    {
      this.type="get_makeup_artist_products";
    }
    console.log(this.type)
    this.no_data=false;
    this.authService.getData(this.type+'?id='+c.id,this.userPostData.token).then((result) => {
      loader.dismiss();
      this.responseData = result;
        console.log(this.responseData)

           this.alProducts=this.responseData.all_products;
           this.businessProducts=this.responseData.business_details;

           if(!this.alProducts.length){
            const toast = this.toastCtrl.create({
              message: 'No Product Added Yet',
              duration: 5000,
              position: 'bottom'
            })
            toast.present();
            this.no_data=true;
           }
    }, (err) => {
      loader.dismiss();
      console.log(err);
      this.message="Oops! Something went wrong.";
      const toast = this.toastCtrl.create({
        message: 'Oops! Something went wrong.',
        duration: 5000,
        cssClass: "toast-danger",
        position: 'bottom'
      })
      toast.present();
    });
  }

  detailsProduct(productId: number,type: string){
    var requestType = type;
    var cate = this.category_id;
    this.authService.getData('get_product_details?product_id='+productId+'&module_id='+cate,this.userPostData.token).then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      this.productDetails = this.responseData;
      if(cate==2)
    {
      this.navCtrl.push(ViewProductBanquatePage,{productDetails: this.productDetails, requestType: requestType});
    }
    else if(cate==3)
    {
      this.navCtrl.push(ViewProductCarPage,{productDetails: this.productDetails, requestType: requestType});
    }
    else if(cate==4)
    {
      this.navCtrl.push(ViewProductCatererPage,{productDetails: this.productDetails, requestType: requestType});
    }

    },
    (err) => {
     this.responseData = err;
     const toast = this.toastCtrl.create({
      message: this.responseData.message,
      duration: 5000,
      cssClass: "toast-danger",
      position: 'bottom'
    })
    toast.present();
    });

  }

  addProduct()
  {
    console.log(this.category_id);
    if(this.category_id == 3)
    this.navCtrl.push(AddCarsPage,this.businessProducts.id);
    else if(this.category_id == 4)
    this.navCtrl.push(AddCatererPage,this.businessProducts.id);
    else if(this.category_id == 2)
    this.navCtrl.push(AddBanquetPage,this.businessProducts.id);
    else if(this.category_id == 5)
    this.navCtrl.push(AddPhotographyPage,this.businessProducts.id);
    else if(this.category_id == 6)
    this.navCtrl.push(AddMakeupArtistPage,this.businessProducts.id);
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

  deleteProduct(productId: number,type: number)
  {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete?',
      buttons: [{
        text: "ok",
        handler: () => {
            //create loader
          let loader = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loader.present();
          this.authService.getData('delete_product?product_id='+productId+'&category='+type,this.userPostData.token).then((result) => {
            loader.dismiss();
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
          else
          {
           const alert = this.alertCtrl.create({
             subTitle: this.responseData.message,
             buttons: ['OK']
           })
           alert.present();
         }
        },
        (err) => {
        loader.dismiss();
         this.responseData = err;
         const toast = this.toastCtrl.create({
          message: this.responseData.message,
          duration: 5000,
          cssClass: "toast-danger",
          position: 'bottom'
        })
        toast.present();
        });
      }
      }, {
        text: "Cancel",
        role: 'cancel'
      }]
    })
    alert.present();
  }

  detailsModule(action: string)
  {
    if(this.category_id==5 && !this.alProducts[0].edit_status && action=="edit")
    this.navCtrl.push(ViewProductPhotographyPage,{action: action,product: this.alProducts[0]});
    else if(this.category_id==5 && action=="details")
    this.navCtrl.push(ViewProductPhotographyPage,{action: action,product: this.alProducts[0], videos: this.responseData.all_photography_video, plans: this.responseData.all_photography_plan, images:this.responseData.all_photography_image});
    if(this.category_id==6 && !this.alProducts[0].edit_status && action=="edit")
    this.navCtrl.push(ViewProductMakeupPage,{action: action,product: this.alProducts[0]});
    else if(this.category_id==6 && action=="details")
    this.navCtrl.push(ViewProductMakeupPage,{action: action,product: this.alProducts[0], videos: this.responseData.all_makeup_video, plans: this.responseData.all_makeup_plan, images:this.responseData.all_makeup_image});
    else if(this.alProducts[0].edit_status && action=="edit")
    {
      const alert = this.alertCtrl.create({
        subTitle: "You have already sent an edit request for this product. Please wait for admin approval.",
        buttons: ['OK']
      })
      alert.present();
    }
  }

  addModule(module: string, category: number)
  {
    console.log(module+' '+category);
    if(category==5)
    this.navCtrl.push(AddPhotoPlanPage,{module:module,id: this.alProducts[0].id});
    else
    this.navCtrl.push(AddMakeupPlanPage,{module:module,id: this.alProducts[0].id});
  }

}
