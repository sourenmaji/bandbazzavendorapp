import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/custom-validators';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

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
    private alertCtrl: AlertController) {
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
    this.token = data.success.token;
    this.addPhotographyForm.get('business_id').setValue(this.navParams.data);
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
    this.addPhotographyForm.get('candid_price').setValue('');
    if(type.name=='studio' && !type.studio)
    this.addPhotographyForm.get('studio_price').setValue('');
    if(type.name=='wedding' && !type.wedding)
    this.addPhotographyForm.get('wedding_price').setValue('');
    if(type.name=='pre_wedding' && !type.pre_wedding)
    this.addPhotographyForm.get('pre_wedding_price').setValue('');
    if(type.name=='cinematic' && !type.cinematic)
    this.addPhotographyForm.get('cinematic_price').setValue('');
  }

}
