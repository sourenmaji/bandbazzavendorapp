
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CustomValidator } from '../../validators/custom-validators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-view-product-makeup',
  templateUrl: 'view-product-makeup.html',
})

export class ViewProductMakeupPage {
  editMakeupForm: FormGroup;
  bridal_makeup: boolean = false;
  guest_makeup: boolean = false;
  at_venue_makeup: boolean = false;
  party_makeup: boolean = false;
  bridal_guest: boolean = false;
  airbrush_makeup: boolean = false;

  business_id: number;
  responseData: any;
  token: string;
  requestType:string;
  productDetails:any;
  payment_mode: any=[];

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

    if(this.productDetails.bridal_makeup_price)
    this.bridal_makeup = true;
    if(this.productDetails.guest_makeup_price)
    this.guest_makeup = true;
    if(this.productDetails.at_venue_makeup_price)
    this.at_venue_makeup = true;
    if(this.productDetails.party_makeup_price)
    this.party_makeup = true;
    if(this.productDetails.bridal_guest_price)
    this.bridal_guest = true;
    if(this.productDetails.airbrush_makeup_price)
    this.airbrush_makeup = true;

    this.editMakeupForm = this.formBuilder.group({
      makeup_artists_id: [this.productDetails.id],
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

      bridal_makeup_price: [this.productDetails.bridal_makeup_price ? this.productDetails.bridal_makeup_price:''],
      guest_makeup_price: [this.productDetails.guest_makeup_price ? this.productDetails.guest_makeup_price : ''],
      at_venue_makeup_price: [this.productDetails.at_venue_makeup_price ? this.productDetails.at_venue_makeup_price : ''],
      party_makeup_price: [this.productDetails.party_makeup_price ? this.productDetails.party_makeup_price : ''],
      bridal_guest_price: [this.productDetails.bridal_guest_price ? this.productDetails.bridal_guest_price : ''],
      airbrush_makeup_price: [this.productDetails.airbrush_makeup_price ? this.productDetails.airbrush_makeup_price : ''],
    }, {validator: CustomValidator.lte('price_to', 'price_from')}); //custom validator lte takes to arguments to check lte condition, first argument is the value that needs to be checked against second argument

    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
    console.log(this.editMakeupForm);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProductPhotographyPage');
  }

  updateMakeup()
  {
    console.log(this.editMakeupForm.value);
    this.restServ.authData(this.editMakeupForm.value,'edit_product_makeup_artist',this.token).then((data) => {
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
    if(type.name=='bridal_makeup' && type.status)
    {
    this.editMakeupForm.get('bridal_makeup_price').setValue('');
    this.editMakeupForm.get('bridal_makeup_price').setValidators(Validators.required);
    this.editMakeupForm.get('bridal_makeup_price').updateValueAndValidity();
    }
    if(type.name=='bridal_makeup' && !type.status)
    {
    this.editMakeupForm.get('bridal_makeup_price').clearValidators();
    this.editMakeupForm.get('bridal_makeup_price').updateValueAndValidity();
    }
    if(type.name=='guest_makeup' && type.status)
    {
    this.editMakeupForm.get('guest_makeup_price').setValue('');
    this.editMakeupForm.get('guest_makeup_price').setValidators(Validators.required);
    this.editMakeupForm.get('guest_makeup_price').updateValueAndValidity();
    }
    if(type.name=='guest_makeup' && !type.status)
    {
    this.editMakeupForm.get('guest_makeup_price').clearValidators();
    this.editMakeupForm.get('guest_makeup_price').updateValueAndValidity();
    }
    if(type.name=='at_venue_makeup' && type.status)
    {
    this.editMakeupForm.get('at_venue_makeup_price').setValue('');
    this.editMakeupForm.get('at_venue_makeup_price').setValidators(Validators.required);
    this.editMakeupForm.get('at_venue_makeup_price').updateValueAndValidity();
    }
    if(type.name=='at_venue_makeup' && !type.status)
    {
    this.editMakeupForm.get('at_venue_makeup_price').clearValidators();
    this.editMakeupForm.get('at_venue_makeup_price').updateValueAndValidity();
    }
    if(type.name=='party_makeup' && type.status)
    {
    this.editMakeupForm.get('party_makeup_price').setValue('');
    this.editMakeupForm.get('party_makeup_price').setValidators(Validators.required);
    this.editMakeupForm.get('party_makeup_price').updateValueAndValidity();
    }
    if(type.name=='party_makeup' && !type.status)
    {
    this.editMakeupForm.get('party_makeup_price').clearValidators();
    this.editMakeupForm.get('party_makeup_price').updateValueAndValidity();
    }
    if(type.name=='bridal_guest' && type.status)
    {
    this.editMakeupForm.get('bridal_guest_price').setValue('');
    this.editMakeupForm.get('bridal_guest_price').setValidators(Validators.required);
    this.editMakeupForm.get('bridal_guest_price').updateValueAndValidity();
    }
    if(type.name=='bridal_guest' && !type.status)
    {
    this.editMakeupForm.get('bridal_guest_price').clearValidators();
    this.editMakeupForm.get('bridal_guest_price').updateValueAndValidity();
    }
    if(type.name=='airbrush_makeup' && type.status)
    {
    this.editMakeupForm.get('airbrush_makeup_price').setValue('');
    this.editMakeupForm.get('airbrush_makeup_price').setValidators(Validators.required);
    this.editMakeupForm.get('airbrush_makeup_price').updateValueAndValidity();
    }
    if(type.name=='airbrush_makeup' && !type.status)
    {
    this.editMakeupForm.get('airbrush_makeup_price').clearValidators();
    this.editMakeupForm.get('airbrush_makeup_price').updateValueAndValidity();
    }

    console.log(this.editMakeupForm);
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

