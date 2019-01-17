import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CustomValidator } from '../../validators/custom-validators';

@IonicPage()
@Component({
  selector: 'page-add-offline-booking',
  templateUrl: 'add-offline-booking.html',
})
export class AddOfflineBookingPage {
  addHallOfflineForm: FormGroup;
  addCarOfflineForm: FormGroup;
  addCatererOfflineForm: FormGroup;

  responseData: any;
  token: string;
  category: number;
  type: string;
  value: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public restServ: AuthServiceProvider,
    private toastCtrl: ToastController) 
    {
    this.addHallOfflineForm = this.formBuilder.group({
      hall_id: ['', Validators.required],
      book_from: ['', Validators.required],
      book_to: ['', Validators.required],
      booking_amount: ['', Validators.required],
      booking_advance: ['', Validators.required],
      cust_name: ['', Validators.required],
      cust_phone: ['', Validators.required],
      
    });

    this.addCarOfflineForm = this.formBuilder.group({
      car_id: ['', Validators.required],
      book_from: ['', Validators.required],
      book_to: ['', Validators.required],
      booking_amount: ['', Validators.required],
      booking_advance: ['', Validators.required],
      cust_name: ['', Validators.required],
      cust_phone: ['', Validators.required],
    });

    this.addCatererOfflineForm = this.formBuilder.group({
      package_id: ['', Validators.required],
      book_date: ['', Validators.required],
      no_of_plates: ['', Validators.required],
      booking_amount: ['', Validators.required],
      booking_advance: ['', Validators.required],
      cust_name: ['', Validators.required],
      cust_phone: ['', Validators.required],
    });

    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.token;
    console.log(this.token);
    this.category=this.navParams.get('category');
    this.restServ.pageReset=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddOfflineBookingPage');
  }

  addOfflineBooking()
  {
    if(this.category==2)
    {
      console.log(this.addHallOfflineForm.value);
      this.type="offline_hall_booking";
      this.value=this.addHallOfflineForm.value;
      
    }
    else if(this.category==3)
    {
      console.log(this.addCarOfflineForm.value);
      this.type="offline_car_booking";
      this.value=this.addCarOfflineForm.value;
    }
    else if(this.category==4)
    {
      console.log(this.addCatererOfflineForm.value);
      this.type="offline_caterer_booking";
      this.value=this.addCatererOfflineForm.value;
    }
    this.restServ.authData(this.value,this.type,this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);
      let toast = this.toastCtrl.create({
        message: this.responseData.message,
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      
      if(this.responseData.status)
      {
        this.restServ.pageReset=true;
        this.navCtrl.pop();
      }
     
    }, (err) => {
     console.log(err);
     let toast = this.toastCtrl.create({
      message: 'Oops! Something went wrong.',
      duration: 5000,
      position: 'bottom',
      cssClass: 'toast-danger'
    });
    toast.present();
    });

  }

}
