import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Slides } from 'ionic-angular';
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
  @ViewChild(Slides) imageSlides: Slides;
  @ViewChild(Slides) videoSlides: Slides;

  editPhotographyForm: FormGroup;
  pre_wedding: boolean = false;
  wedding: boolean = false;
  candid: boolean = false;
  studio: boolean = false;
  cinematic: boolean = false;
  business_id: number;
  responseData: any;
  type:string;
  message:string;
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
    this.token = data.token;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProductPhotographyPage');
  }

  updatePhotography()
  {
    console.log(this.editPhotographyForm.value);
    this.authService.authData(this.editPhotographyForm.value,'edit_product_photography',this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);

      let toast = this.toastCtrl.create({
        message: this.responseData.message,
        duration: 2000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        if(this.responseData.status==true)
        {
          this.authService.pageReset=true;
          this.navCtrl.pop();
        }
      });

      toast.present();
    }, (err) => {

     console.log(err);
     let toast = this.toastCtrl.create({
      message: 'Something went wrong! Please try again.',
      duration: 2000,
      position: 'top'
    });
    toast.present();
    });
  }

  resetCheckboxes(type: any)
  {
    console.log(type);
    if(type.name=='candid' && type.status)
    {
    this.editPhotographyForm.get('candid_price').setValue('');
    this.editPhotographyForm.get('candid_price').setValidators(Validators.required);
    this.editPhotographyForm.get('candid_price').updateValueAndValidity();
    }
    if(type.name=='candid' && !type.status)
    {
    this.editPhotographyForm.get('candid_price').clearValidators();
    this.editPhotographyForm.get('candid_price').updateValueAndValidity();
    }
    if(type.name=='studio' && type.status)
    {
    this.editPhotographyForm.get('studio_price').setValue('');
    this.editPhotographyForm.get('studio_price').setValidators(Validators.required);
    this.editPhotographyForm.get('studio_price').updateValueAndValidity();
    }
    if(type.name=='studio' && !type.status)
    {
    this.editPhotographyForm.get('studio_price').clearValidators();
    this.editPhotographyForm.get('studio_price').updateValueAndValidity();
    }
    if(type.name=='wedding' && type.status)
    {
    this.editPhotographyForm.get('wedding_price').setValue('');
    this.editPhotographyForm.get('wedding_price').setValidators(Validators.required);
    this.editPhotographyForm.get('wedding_price').updateValueAndValidity();
    }
    if(type.name=='wedding' && !type.status)
    {
    this.editPhotographyForm.get('wedding_price').clearValidators();
    this.editPhotographyForm.get('wedding_price').updateValueAndValidity();
    }
    if(type.name=='pre_wedding' && type.status)
    {
    this.editPhotographyForm.get('pre_wedding_price').setValue('');
    this.editPhotographyForm.get('pre_wedding_price').setValidators(Validators.required);
    this.editPhotographyForm.get('pre_wedding_price').updateValueAndValidity();
    }
    if(type.name=='pre_wedding' && !type.status)
    {
    this.editPhotographyForm.get('pre_wedding_price').clearValidators();
    this.editPhotographyForm.get('pre_wedding_price').updateValueAndValidity();
    }
    if(type.name=='cinematic' && type.status)
    {
    this.editPhotographyForm.get('cinematic_price').setValue('');
    this.editPhotographyForm.get('cinematic_price').setValidators(Validators.required);
    this.editPhotographyForm.get('cinematic_price').updateValueAndValidity();
    }
    if(type.name=='cinematic' && !type.status)
    {
    this.editPhotographyForm.get('cinematic_price').clearValidators();
    this.editPhotographyForm.get('cinematic_price').updateValueAndValidity();
    }

    console.log(this.editPhotographyForm);
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
            this.type='delete_photography_plan?plan_id='+id;
            else if(module=='video')
            this.type='delete_photography_video?video_id='+id;
            else
            this.type='delete_photography_image?image_id='+id;
            this.authService.getData(this.type,this.token).then((result) => {

              this.responseData = result;
                console.log(this.responseData);
                let toast = this.toastCtrl.create({
                  message: this.responseData.message,
                  duration: 2000,
                  position: 'top'
                });

                toast.onDidDismiss(() => {
                  console.log('Dismissed toast');
                  if(this.responseData.status==true)
                  {
                    this.authService.pageReset=true;
                    this.navCtrl.pop();
                  }
                });

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
