import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-view-product-car',
  templateUrl: 'view-product-car.html',
})
export class ViewProductCarPage implements OnInit{
  acAvailable: boolean;
  carModelAvailable: boolean = false;
  responseData: any;
  productDetails: any;
  productImages: any[] = [];
  productValue: any;
  requestType: any;
  editProductform: FormGroup;
  public carbrands: {car_company_name:string, id: number}[];
  public carmodels: {car_model:string, model_id:number}[];
  public cartypes:  {type:string, id:number}[];
  userPostData = {"user":"","token":""};
  userData = {carId: "", miniHirePeriod: "",seatNo: "",minHireDistance: "",advanceAmount: "",nonAcPriceHourly: "",nonAcpriceKm: "",acPriceHourly: "",acpriceKm:"", availableAc: 0, images: []};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera, 
    public authService: AuthServiceProvider,
    public imagePicker: ImagePicker , 
    public alertCtrl: AlertController, 
    public platform: Platform, 
    public toastCtrl: ToastController)
    {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userPostData.token = data.token;
  this.productDetails = this.navParams.get('productDetails');
  console.log(this.productDetails)

  this.requestType = this.navParams.get('requestType');
  this.productValue = this.productDetails.details.car;
  console.log(this.productValue);
  if(this.productValue.ac_car_price_hour != null){
    this.acAvailable = true;
    this.userData.availableAc = 1;
  }
  else{
    this.acAvailable = false;
    this.userData.availableAc = 0;
  }
  this.productImages = [];
  this.productImages.push(this.productValue.cover_image);
  console.log(this.productImages);
  this.productDetails.details.images.forEach(element => {
    this.productImages.push(element.url);
  });
  console.log(this.productImages);

  let backAction =  platform.registerBackButtonAction(() => {
    this.navCtrl.pop();
    backAction();
  },2)
}
onChange(value){
console.log(value);
if(value == 1){
  this.acAvailable = true;
}else{
  this.acAvailable = false;
}
}

ngOnInit() {
  let AMOUNTPATTERN = /^[0-9]/;
  this.editProductform = new FormGroup({
    miniHirePeriod: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    // seatNo: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    minHireDistance: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    advanceAmount: new FormControl('', [Validators.pattern(AMOUNTPATTERN)]),
    nonAcPriceHourly: new FormControl('', [Validators.pattern(AMOUNTPATTERN)]),
    nonAcpriceKm: new FormControl('', [Validators.pattern(AMOUNTPATTERN)]),
    acPriceHourly: new FormControl('', [ Validators.pattern(AMOUNTPATTERN)]),
    availableAc: new FormControl('',  Validators.compose([])),
    carId: new FormControl('',  Validators.compose([])),
    acpriceKm: new FormControl('', [ Validators.pattern(AMOUNTPATTERN)])

  });
  this.authService.pageReset=false;
}

presentActionSheet() {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'Choose your method',
    buttons: [
      {
        text: 'Take a picture',
        handler: () => {
          this.chooseFromCam();
          console.log('Destructive clicked');
        }
      },
      {
        text: 'Select from gallery',
        handler: () => {
          this.pickImage();
          console.log('Archive clicked');
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });

  actionSheet.present();
}

chooseFromCam(){
  let remaining = 5 - this.productImages.length;
  if(remaining <= 0)
  {
    return;
  }
  const options: CameraOptions = {
  quality: 10,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
};

this.camera.getPicture(options).then((imageData) => {
  // imageData is either a base64 encoded string or a file URI
  // If it's base64 (DATA_URL):
  //let base64Image = 'data:image/jpeg;base64,' + imageData;
  //this.imagestring.push("data:image/jpeg;base64,"+imageData);
      this.productImages.push("data:image/jpeg;base64,"+imageData);
  //console.log(imageData);
 }, (err) => {
  // Handle error
   const toast = this.toastCtrl.create({
    message: err,
    duration: 5000,
    cssClass: "toast-danger",
    position: 'bottom'
  })
  toast.present();
 });

}

pickImage()
{
  let remaining = 5 - this.productImages.length;
  if(remaining <= 0)
  {
    return;
  }
  this.imagePicker.getPictures({maximumImagesCount:remaining, quality:50, outputType:1}).then
  (results =>{
    console.log(results);

    for(let i=0; i < results.length;i++){
        this.productImages.push("data:image/jpeg;base64,"+results[i]);
    };
  }, (err) => {
    // Handle error
     const toast = this.toastCtrl.create({
      message: err,
      duration: 5000,
      position: 'bottom'
    })
    toast.present();
   });
}

uploadData()
{
  //call rest service and upload the carData
  var data = this.userData;
  data.images = [];
  this.productImages.forEach(element => {
    data.images.push(element);
  });
  console.log(data);
  this.authService.authData(data,'edit_product_car',this.userPostData.token).then((data) => {
    this.responseData = data;
    if(this.responseData.status == true){
      this.navCtrl.pop();
      this.authService.pageReset=true;
      const alert = this.alertCtrl.create({
        subTitle: this.responseData.message,
        buttons: ['OK']

      })
      alert.present();
    }else{
      const alert = this.alertCtrl.create({
        subTitle: this.responseData.message,
        buttons: ['OK']
      })
      alert.present();
    }

  }, (err) => {
   this.responseData = err;
   console.log(this.responseData)
 // Handle error
 const toast = this.toastCtrl.create({
  message: err,
  duration: 5000,
  cssClass: "toast-danger",
  position: 'bottom'
})
toast.present();
});
}


removeImage(src: any)
  {
    console.log(src);
    let newimage: any = [];
    this.productImages.forEach(element => {
      if(element != src)
        newimage.push(element);
    });
    console.log(newimage)
    this.productImages = newimage;
  }

}
