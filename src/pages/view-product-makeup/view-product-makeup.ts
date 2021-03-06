
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, IonicPage, NavController, NavParams, Slides, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CustomValidator } from '../../validators/custom-validators';

@IonicPage()
@Component({
  selector: 'page-view-product-makeup',
  templateUrl: 'view-product-makeup.html',
})

export class ViewProductMakeupPage {
  @ViewChild(Slides) imageSlides: Slides;
  @ViewChild(Slides) videoSlides: Slides;

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
  type: string;
  message: string;

  videos:any=[];
  images:any=[];
  plans:any=[];
  imageUrl:string;
  videoUrl: SafeResourceUrl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authService: AuthServiceProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private domSanitizer: DomSanitizer) {

    console.log(this.navParams.data);
    this.requestType=this.navParams.get('action');
    this.productDetails=this.navParams.get('product');
    this.videos=this.navParams.get('videos');
    this.images=this.navParams.get('images');
    this.plans=this.navParams.get('plans');
    this.imageUrl=this.authService.imageUrl;
    this.authService.pageReset=false;

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
    this.token = data.token;
    console.log(this.editMakeupForm);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProductPhotographyPage');
  }

  updateMakeup()
  {
    console.log(this.editMakeupForm.value);
    this.authService.authData(this.editMakeupForm.value,'edit_product_makeup_artist',this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);
      let toast = this.toastCtrl.create({
        message: this.responseData.message,
        duration: 5000,
        position: 'bottom'
      });

        console.log('Dismissed toast');
        if(this.responseData.status==true)
        {
          this.authService.pageReset=true;
          this.navCtrl.pop();
        }

      toast.present();
    }, (err) => {

     console.log(err);
     let toast = this.toastCtrl.create({
      message: 'Something went wrong! Please try again.',
      duration: 5000,
      cssClass: "toast-danger",
      position: 'bottom'
    });
    toast.present();
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

  getStyle(plan: any) {
    if(plan.admin_approval=='Yes')
    return '#33FF80';
    else if(plan.admin_approval=='No' && plan.admin_comment)
    return '#FF4C33';
    else
    return '#E0FF33';
  }

  planDelete(id: any, module: string)
  {
    let alert = this.alertCtrl.create({
      title: 'Delete',
      message: 'Do you want to delete this '+module+'?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            console.log(id);
            if(module=='plan')
            this.type='delete_makeup_plan?plan_id='+id;
            else if(module=='video')
            this.type='delete_makeup_video?video_id='+id;
            else
            this.type='delete_makeup_image?image_id='+id;
            this.authService.getData(this.type,this.token).then((result) => {

              this.responseData = result;
                console.log(this.responseData);
                let toast = this.toastCtrl.create({
                  message: this.responseData.message,
                  duration: 5000,
                  position: 'bottom'
                });

              
                  if(this.responseData.status==true)
                  {
                    this.authService.pageReset=true;
                    this.navCtrl.pop();
                  }
             

                toast.present();
            }, (err) => {

              console.log(err)
              this.message="Oops! Something went wrong.";

            });

          }
        }
      ]
    });
    alert.present();
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

