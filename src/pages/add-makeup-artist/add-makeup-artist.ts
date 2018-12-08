import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/custom-validators';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-add-makeup-artist',
  templateUrl: 'add-makeup-artist.html',
})
export class AddMakeupArtistPage {
  addMakeupForm: FormGroup;
  bridal_makeup: boolean = false;
  guest_makeup: boolean = false;
  at_venue_makeup: boolean = false;
  party_makeup: boolean = false;
  bridal_guest: boolean = false;
  airbrush_makeup: boolean = false;

  business_id: number;
  responseData: any;
  token: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public restServ: AuthServiceProvider,
    private alertCtrl: AlertController) {
    this.addMakeupForm = this.formBuilder.group({
      business_id: [''],
      travel_policy: [''],
      working_since: [''],
      completed_project: [''],
      primary_market: [''],
      price_from: ['', Validators.required],
      price_to: [''],
      achievements: [''],
      cancellation_policy: [''],
      payment_mode: ['', Validators.required],
      advance_booking_charge: ['', CustomValidator.validpercent],
      event_date_charge: ['', CustomValidator.validpercent],
      at_delivery_charge: ['', CustomValidator.validpercent],
      bridal_makeup_price: [''],
      guest_makeup_price: [''],
      at_venue_makeup_price: [''],
      party_makeup_price: [''],
      bridal_guest_price: [''],
      airbrush_makeup_price: [''],
      search_tags: ['']
    }, {validator: CustomValidator.lte('price_to', 'price_from')}); //custom validator lte takes to arguments to check lte condition, first argument is the value that needs to be checked against second argument
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
    this.addMakeupForm.get('business_id').setValue(this.navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMakeupArtistPage');
  }

  addMakeup()
  {
    console.log(this.addMakeupForm.value);
    this.restServ.authData(this.addMakeupForm.value,'add_product_makeup_artist',this.token).then((data) => {
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
    this.addMakeupForm.get('bridal_makeup_price').setValue('');
    this.addMakeupForm.get('bridal_makeup_price').setValidators(Validators.required);
    this.addMakeupForm.get('bridal_makeup_price').updateValueAndValidity();
    }
    if(type.name=='bridal_makeup' && !type.status)
    {
    this.addMakeupForm.get('bridal_makeup_price').clearValidators();
    this.addMakeupForm.get('bridal_makeup_price').updateValueAndValidity();
    }
    if(type.name=='guest_makeup' && type.status)
    {
    this.addMakeupForm.get('guest_makeup_price').setValue('');
    this.addMakeupForm.get('guest_makeup_price').setValidators(Validators.required);
    this.addMakeupForm.get('guest_makeup_price').updateValueAndValidity();
    }
    if(type.name=='guest_makeup' && !type.status)
    {
    this.addMakeupForm.get('guest_makeup_price').clearValidators();
    this.addMakeupForm.get('guest_makeup_price').updateValueAndValidity();
    }
    if(type.name=='at_venue_makeup' && type.status)
    {
    this.addMakeupForm.get('at_venue_makeup_price').setValue('');
    this.addMakeupForm.get('at_venue_makeup_price').setValidators(Validators.required);
    this.addMakeupForm.get('at_venue_makeup_price').updateValueAndValidity();
    }
    if(type.name=='at_venue_makeup' && !type.status)
    {
    this.addMakeupForm.get('at_venue_makeup_price').clearValidators();
    this.addMakeupForm.get('at_venue_makeup_price').updateValueAndValidity();
    }
    if(type.name=='party_makeup' && type.status)
    {
    this.addMakeupForm.get('party_makeup_price').setValue('');
    this.addMakeupForm.get('party_makeup_price').setValidators(Validators.required);
    this.addMakeupForm.get('party_makeup_price').updateValueAndValidity();
    }
    if(type.name=='party_makeup' && !type.status)
    {
    this.addMakeupForm.get('party_makeup_price').clearValidators();
    this.addMakeupForm.get('party_makeup_price').updateValueAndValidity();
    }
    if(type.name=='bridal_guest' && type.status)
    {
    this.addMakeupForm.get('bridal_guest_price').setValue('');
    this.addMakeupForm.get('bridal_guest_price').setValidators(Validators.required);
    this.addMakeupForm.get('bridal_guest_price').updateValueAndValidity();
    }
    if(type.name=='bridal_guest' && !type.status)
    {
    this.addMakeupForm.get('bridal_guest_price').clearValidators();
    this.addMakeupForm.get('bridal_guest_price').updateValueAndValidity();
    }
    if(type.name=='airbrush_makeup' && type.status)
    {
    this.addMakeupForm.get('airbrush_makeup_price').setValue('');
    this.addMakeupForm.get('airbrush_makeup_price').setValidators(Validators.required);
    this.addMakeupForm.get('airbrush_makeup_price').updateValueAndValidity();
    }
    if(type.name=='airbrush_makeup' && !type.status)
    {
    this.addMakeupForm.get('airbrush_makeup_price').clearValidators();
    this.addMakeupForm.get('airbrush_makeup_price').updateValueAndValidity();
    }

    console.log(this.addMakeupForm);
  }

}

