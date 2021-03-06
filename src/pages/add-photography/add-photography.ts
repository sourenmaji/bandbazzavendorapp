import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CustomValidator } from '../../validators/custom-validators';

@IonicPage()
@Component({
  selector: 'page-add-photography',
  templateUrl: 'add-photography.html',
})
export class AddPhotographyPage {
  addPhotographyForm: FormGroup;
  pre_wedding: boolean = false;
  wedding: boolean = false;
  candid: boolean = false;
  studio: boolean = false;
  cinematic: boolean = false;
  business_id: number;
  responseData: any;
  token: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public restServ: AuthServiceProvider,
    private toastCtrl: ToastController) {
    this.addPhotographyForm = this.formBuilder.group({
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
      pre_wedding_price: [''],
      wedding_price: [''],
      candid_price: [''],
      studio_price: [''],
      cinematic_price: [''],
      photo_album_price: ['', Validators.required],
      storage_device: ['', Validators.required],
      raw_image_delivery: ['', Validators.required],
      delivery_duration: [''],
      search_tags: ['']
    }, {validator: CustomValidator.lte('price_to', 'price_from')}); //custom validator lte takes to arguments to check lte condition, first argument is the value that needs to be checked against second argument
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.token;
    this.addPhotographyForm.get('business_id').setValue(this.navParams.data);

    this.restServ.pageReset=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPhotographyPage');
  }

  addPhotography()
  {
    console.log(this.addPhotographyForm.value);
    this.restServ.authData(this.addPhotographyForm.value,'add_product_photography',this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);
      if(this.responseData.status==true)
      {
        let toast = this.toastCtrl.create({
          message: this.responseData.message,
          duration: 5000,
          position: 'bottom'
        });
        toast.present();

        this.restServ.pageReset=true;
        this.navCtrl.pop();
      }
      else
      {
        let toast = this.toastCtrl.create({
          message: this.responseData.message,
          duration: 5000,
          position: 'bottom'
        });
        toast.present();
      }

    }, (err) => {
     this.responseData = err;
     console.log(this.responseData);
     let toast = this.toastCtrl.create({
      message: "Something went wrong! Please try again.",
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
    if(type.name=='candid' && type.status)
    {
    this.addPhotographyForm.get('candid_price').setValue('');
    this.addPhotographyForm.get('candid_price').setValidators(Validators.required);
    this.addPhotographyForm.get('candid_price').updateValueAndValidity();
    }
    if(type.name=='candid' && !type.status)
    {
    this.addPhotographyForm.get('candid_price').clearValidators();
    this.addPhotographyForm.get('candid_price').updateValueAndValidity();
    }
    if(type.name=='studio' && type.status)
    {
    this.addPhotographyForm.get('studio_price').setValue('');
    this.addPhotographyForm.get('studio_price').setValidators(Validators.required);
    this.addPhotographyForm.get('studio_price').updateValueAndValidity();
    }
    if(type.name=='studio' && !type.status)
    {
    this.addPhotographyForm.get('studio_price').clearValidators();
    this.addPhotographyForm.get('studio_price').updateValueAndValidity();
    }
    if(type.name=='wedding' && type.status)
    {
    this.addPhotographyForm.get('wedding_price').setValue('');
    this.addPhotographyForm.get('wedding_price').setValidators(Validators.required);
    this.addPhotographyForm.get('wedding_price').updateValueAndValidity();
    }
    if(type.name=='wedding' && !type.status)
    {
    this.addPhotographyForm.get('wedding_price').clearValidators();
    this.addPhotographyForm.get('wedding_price').updateValueAndValidity();
    }
    if(type.name=='pre_wedding' && type.status)
    {
    this.addPhotographyForm.get('pre_wedding_price').setValue('');
    this.addPhotographyForm.get('pre_wedding_price').setValidators(Validators.required);
    this.addPhotographyForm.get('pre_wedding_price').updateValueAndValidity();
    }
    if(type.name=='pre_wedding' && !type.status)
    {
    this.addPhotographyForm.get('pre_wedding_price').clearValidators();
    this.addPhotographyForm.get('pre_wedding_price').updateValueAndValidity();
    }
    if(type.name=='cinematic' && type.status)
    {
    this.addPhotographyForm.get('cinematic_price').setValue('');
    this.addPhotographyForm.get('cinematic_price').setValidators(Validators.required);
    this.addPhotographyForm.get('cinematic_price').updateValueAndValidity();
    }
    if(type.name=='cinematic' && !type.status)
    {
    this.addPhotographyForm.get('cinematic_price').clearValidators();
    this.addPhotographyForm.get('cinematic_price').updateValueAndValidity();
    }

    console.log(this.addPhotographyForm);
  }


}
