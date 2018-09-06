import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CustomValidator } from '../../validators/custom-validators';

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public restServ: AuthServiceProvider,
    private alertCtrl: AlertController) {

    console.log(this.navParams.data);
    this.requestType=this.navParams.get('action');
    this.productDetails=this.navParams.get('product');


    this.editPhotographyForm = this.formBuilder.group({
      business_id: [this.productDetails.business_id],
      travel_policy: [this.productDetails.travel_policy],
      working_since: [""+this.productDetails.working_since],
      completed_project: [this.productDetails.completed_project],
      primary_market: [this.productDetails.primary_market],
      price_from: [this.productDetails.price_from, Validators.required],
      price_to: [this.productDetails.price_to],
      achievements: [this.productDetails.achievements],
      cancellation_policy: [this.productDetails.cancellation_policy],
      payment_mode: ['', Validators.required],
      advance_booking_charge: [this.productDetails.advance_booking_charge, CustomValidator.validpercent],
      event_date_charge: [this.productDetails.event_date_charge, CustomValidator.validpercent],
      at_delivery_charge: [this.productDetails.at_delivery_charge, CustomValidator.validpercent],
      pre_wedding_price: [this.productDetails.pre_wedding_price ? this.productDetails.pre_wedding_price:''],
      wedding_price: [this.productDetails.wedding_price ? this.productDetails.wedding_price : ''],
      candid_price: [this.productDetails.candid_price ? this.productDetails.candid_price : ''],
      studio_price: [this.productDetails.studio_price ? this.productDetails.studio_price : ''],
      cinematic_price: [this.productDetails.cinematic_price ? this.productDetails.cinematic_price : ''],
      photo_album_price: [this.productDetails.photo_album_price, Validators.required],
      storage_device: [this.productDetails.storage_device, Validators.required],
      raw_image_delivery: [this.productDetails.raw_image_delivery ? this.productDetails.raw_image_delivery: '', Validators.required],
      delivery_duration: ['']
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
  }

}
