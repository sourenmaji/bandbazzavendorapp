import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-photography',
  templateUrl: 'add-photography.html',
})
export class AddPhotographyPage {
  addPhotographyForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.addPhotographyForm = this.formBuilder.group({
      travel_policy: [''],
      working_since: [''],
      completed_project: [''],
      primary_market: [''],
      price_from: [''],
      price_to: [''],
      achievements: [''],
      cancellation_policy: [''],
      payment_mode: [''],
      advance_booking_charge: [''],
      event_date_charge: [''],
      at_delivery_charge: [''],
    });
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad AddPhotographyPage');
  }

  addPhotography()
  {
    console.log(this.addPhotographyForm.value.event_date_charge);
  }

}
