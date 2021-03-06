import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-view-product-caterer',
  templateUrl: 'view-product-caterer.html',
})
export class ViewProductCatererPage implements OnInit{
  responseData: any;
  productDetails: any;
  productImages: any[]=[];
  productValue: any;
  requestType: any;
  editProductform: FormGroup;
  userData = {catererId: "", startingPrice: "",minimumPlate: "", images: []};
  userPostData = {"user":"","token":""};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public camera: Camera, 
              public authService: AuthServiceProvider,
              public imagePicker: ImagePicker, 
              public alertCtrl: AlertController,
              public toastCtrl: ToastController, 
              public platform: Platform) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userPostData.token = data.token;
    this.requestType = this.navParams.get('requestType');
  this.productDetails = this.navParams.get('productDetails');
  this.productValue = this.productDetails.details.package;
  this.productImages = [];
  this.productImages.push(this.productValue.cover_image);

  this.productDetails.details.images.forEach(element => {
    this.productImages.push(element.url);
  });
  let backAction =  platform.registerBackButtonAction(() => {
    this.navCtrl.pop();
    backAction();
  },2)
  console.log(this.productImages);
}

ngOnInit() {
  let AMOUNTPATTERN = /^[0-9]/;
  this.editProductform = new FormGroup({
    startingPrice: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    minimumPlate: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    catererId: new FormControl('',  Validators.compose([]))
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
 }, (err) => {
  // Handle error
  // alert(err);
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
        // alert(this.productImages);
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
  //alert(carData);
  //call the rest here..
  this.authService.authData(data,'edit_product_caterer',this.userPostData.token).then((data) => {
    this.responseData = data;
    if(this.responseData.status == true)
    {
      let toast = this.toastCtrl.create({
        message: this.responseData.message,
        duration: 5000,
        position: 'bottom'
      });
      toast.present();

      this.authService.pageReset=true;
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
   console.log(this.responseData)
   // Handle error
 let toast = this.toastCtrl.create({
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
    if(this.productImages.length==1)
    {
      let toast = this.toastCtrl.create({
        message: "Select at least one image",
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    let newimage: any = [];
    this.productImages.forEach(element => {
      if(element != src)
        newimage.push(element);
    });
    this.productImages = newimage;
  }


}
