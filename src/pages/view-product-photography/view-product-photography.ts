import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CustomValidator } from '../../validators/custom-validators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-view-product-photography',
  templateUrl: 'view-product-photography.html',
})
export class ViewProductPhotographyPage {
  editPhotographyForm: FormGroup;
  pre_wedding: boolean = false;
  wedding: boolean = false;
  candid: boolean = false;
  studio: boolean = false;
  cinematic: boolean = false;
  business_id: number;
  responseData: any;
  token: string;
  requestType:string;
  productDetails:any;
  payment_mode: any=[];
  storage_device:any=[];
  videos:any=[];
  images:any=[];
  plans:any=[];
  imageUrl:string;
  videoUrl: SafeResourceUrl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public restServ: AuthServiceProvider,
    private alertCtrl: AlertController,
    private domSanitizer: DomSanitizer) {

    console.log(this.navParams.data);
    this.requestType=this.navParams.get('action');
    this.productDetails=this.navParams.get('product');
    this.videos=this.navParams.get('videos');
    this.images=this.navParams.get('images');
    this.plans=this.navParams.get('plans');
    this.imageUrl=this.restServ.imageUrl;
    this.restServ.pageReset=false;

    if(this.productDetails.payment_mode)
    {
      this.payment_mode=this.productDetails.payment_mode.split("##");
      console.log(this.productDetails.payment_mode);
    }
    if(this.productDetails.storage_device)
    {
      this.storage_device=this.productDetails.storage_device.split("##");
      console.log(this.productDetails.storage_device);
    }
    if(this.productDetails.pre_wedding_price)
    this.pre_wedding = true;
    if(this.productDetails.wedding_price)
    this.wedding = true;
    if(this.productDetails.candid_price)
    this.candid = true;
    if(this.productDetails.studio_price)
    this.studio = true;
    if(this.productDetails.cinematic_price)
    this.cinematic = true;

    this.editPhotographyForm = this.formBuilder.group({
      photographer_id: [this.productDetails.id],
      travel_policy: [this.productDetails.travel_policy],
      working_since: [""+this.productDetails.working_since],
      completed_project: [this.productDetails.completed_project],
      primary_market: [this.productDetails.primary_market],
      price_from: [this.productDetails.price_from, Validators.required],
      price_to: [this.productDetails.price_to],
      achievements: [this.productDetails.achievements],
      cancellation_policy: [this.productDetails.cancellation_policy],
      payment_mode: [this.payment_mode, Validators.required],
      advance_booking_charge: [this.productDetails.advance_booking_charge, CustomValidator.validpercent],
      event_date_charge: [this.productDetails.event_date_charge, CustomValidator.validpercent],
      at_delivery_charge: [this.productDetails.at_delivery_charge, CustomValidator.validpercent],
      pre_wedding_price: [this.productDetails.pre_wedding_price ? this.productDetails.pre_wedding_price:''],
      wedding_price: [this.productDetails.wedding_price ? this.productDetails.wedding_price : ''],
      candid_price: [this.productDetails.candid_price ? this.productDetails.candid_price : ''],
      studio_price: [this.productDetails.studio_price ? this.productDetails.studio_price : ''],
      cinematic_price: [this.productDetails.cinematic_price ? this.productDetails.cinematic_price : ''],
      photo_album_price: [this.productDetails.photo_album_price, Validators.required],
      storage_device: [this.storage_device, Validators.required],
      raw_image_delivery: [this.productDetails.raw_image_delivery=='Yes' ? 1 : 0, Validators.required],
      delivery_duration: [this.productDetails.delivery_duration ? this.productDetails.delivery_duration: '']
    }, {validator: CustomValidator.lte('price_to', 'price_from')}); //custom validator lte takes to arguments to check lte condition, first argument is the value that needs to be checked against second argument

    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProductPhotographyPage');
  }

  updatePhotography()
  {
    console.log(this.editPhotographyForm.value);
    this.restServ.authData(this.editPhotographyForm.value,'edit_product_photography',this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);
      if(this.responseData.status==true)
      {
        this.restServ.pageReset=true;
        this.navCtrl.pop();
        const alert = this.alertCtrl.create({
        subTitle: this.responseData.message,
        buttons: ['OK']

      })
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

    }, (err) => {
     this.responseData = err;
     console.log(this.responseData)
     const alert = this.alertCtrl.create({
      subTitle: "Something went wrong! Please try again.",
      buttons: ['OK']
    })
    alert.present();
    });
  }

  resetCheckboxes(type: any)
  {
    console.log(type);
    if(type.name=='candid' && !type.candid)
    this.editPhotographyForm.get('candid_price').setValue('');
    if(type.name=='studio' && !type.studio)
    this.editPhotographyForm.get('studio_price').setValue('');
    if(type.name=='wedding' && !type.wedding)
    this.editPhotographyForm.get('wedding_price').setValue('');
    if(type.name=='pre_wedding' && !type.pre_wedding)
    this.editPhotographyForm.get('pre_wedding_price').setValue('');
    if(type.name=='cinematic' && !type.cinematic)
    this.editPhotographyForm.get('cinematic_price').setValue('');
  }

  updateVideoUrl(video_link: string) {
    // Appending an ID to a YouTube URL is safe.
    // Always make sure to construct SafeValue objects as
    // close as possible to the input data, so
    // that it's easier to check if the value is safe.
    let videoUrl = video_link;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl);
}

}
