import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform, Slides } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-view-product-banquate',
  templateUrl: 'view-product-banquate.html',
})
export class ViewProductBanquatePage implements OnInit{
  @ViewChild(Slides) slides: Slides;
  responseData: any;
  productDetails: any;
  requestType: any;
  productImages: any[]=[];
  lat: any;
  log: any;
  url: SafeResourceUrl;
 editProductform: FormGroup;
 userData = {banquetId: "", hallPrice: "",advanceAmount: "",capacity: "",acCharges: "",availableAc: 0,foodType: 0, images: []};
 userPostData = {"user":"","token":""};

  constructor(public navCtrl: NavController, public navParams: NavParams,public imagePicker: ImagePicker,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera, public authService: AuthServiceProvider, public alertCtrl: AlertController,
  public platform: Platform, public domSanitizer: DomSanitizer) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userPostData.token = data.token;
  this.productDetails = this.navParams.get('productDetails');
  this.requestType = this.navParams.get('requestType');
  this.lat = this.productDetails.details.lat;
  this.log = this.productDetails.details.lng;
  this.productImages = [];

  this.productImages.push(this.productDetails.details.view);

this.productDetails.details.images.forEach(element => {
    this.productImages.push(element.url);
  });

  console.log(this.productDetails);
  this.userData.availableAc= this.productDetails.details.is_ac;
  this.userData.foodType = this.productDetails.details.is_nonveg;
  console.log(this.userData.availableAc);
  let backAction =  platform.registerBackButtonAction(() => {
    this.navCtrl.pop();
    backAction();
  },2)
}
ionViewDidLoad(){
  this.authService.pageReset=false;
  this.lat = this.productDetails.details.lat;
  this.log = this.productDetails.details.lng;
}

ngOnInit() {
  let AMOUNTPATTERN = /^[0-9]/;
  this.editProductform = new FormGroup({
    hallPrice: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN), this.lessThan('advanceAmount')]),
    advanceAmount: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN), this.greaterThan('hallPrice')]),
    capacity: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    acCharges: new FormControl('', [Validators.pattern(AMOUNTPATTERN)]),
    availableAc: new FormControl('',  Validators.compose([])),
    foodType: new FormControl('',  Validators.compose([])),
    banquetId: new FormControl('',  Validators.compose([]))
  });
}

lessThan(field_name): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {

  let input = control.value;
  //console.log(input);
  let isValid=(+control.root.value[field_name])<(+input)
 // console.log(isValid);
  if(!isValid)
  return { 'lessThan': true }
  else
  return null;
  };
  }

greaterThan(field_name): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {

  let input = control.value;
 // console.log(input);
  let isValid=(+control.root.value[field_name])>(+input)
 // console.log(isValid);
  if(!isValid)
  return { 'greaterThan': true }
  else
  return null;
  };
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
      this.productImages.push("data:image/jpeg;base64,"+imageData);

 }, (err) => {
  // Handle error
 });
}

pickImage()
{
  let remaining = 5 - this.productImages.length;
  if(remaining <= 0)
  {
    return;
  }
  this.imagePicker.getPictures({maximumImagesCount:remaining, quality:10, outputType:1}).then
  (results =>{
    console.log(results);
    for(let i=0; i < results.length;i++){
        this.productImages.push("data:image/jpeg;base64,"+results[i]);
    };
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

  this.authService.authData(data,'edit_product_banquet',this.userPostData.token).then((data) => {
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

  });
}


removeImage(src: any)
  {
    let newimage: any = [];
    this.productImages.forEach(element => {
      if(element != src)
        newimage.push(element);
    });
    this.productImages = newimage;
  }


  updateImageUrl(video_link: string) {
    // Appending an ID to a YouTube URL is safe.
    // Always make sure to construct SafeValue objects as
    // close as possible to the input data, so
    // that it's easier to check if the value is safe.
    let url = video_link;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
}

}
