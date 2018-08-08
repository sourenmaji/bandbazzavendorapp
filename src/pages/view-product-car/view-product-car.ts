import { ImagePicker } from '@ionic-native/image-picker';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';


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
  URL = 'http://192.168.0.130/BandBazza/public/api/';
  editProductform: FormGroup;
  public carbrands: {car_company_name:string, id: number}[];
  public carmodels: {car_model:string, model_id:number}[];
  public cartypes:  {type:string, id:number}[];
  //userData = { maxHirePeriod: "",minHireDistance: "",advanceAmount: "",nonAcPriceHourly: "",nonAcpriceKm: "",acPriceHourly: "",acpriceKm:"", availableAc: 0, images: []};
  userPostData = {"user":"","token":""};
  userData = {carId: "", miniHirePeriod: "",seatNo: "",minHireDistance: "",advanceAmount: "",nonAcPriceHourly: "",nonAcpriceKm: "",acPriceHourly: "",acpriceKm:"", availableAc: 0, images: []};

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
    public camera: Camera, public authService: AuthServiceProvider,
    public imagePicker: ImagePicker , public alertCtrl: AlertController) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userPostData.token = data.success.token;
  this.productDetails = this.navParams.get('productDetails');

  this.requestType = this.navParams.get('requestType');
  this.productValue = this.productDetails.details.car;
  // this.userData.brandName = this.productValue.car_company_name;
  // this.userData.models = this.productValue.car_model;
  if(this.productValue.ac_car_price_hour != null){
    this.acAvailable = true;
    this.userData.availableAc = 1;
  }else{
    this.acAvailable = false;
    this.userData.availableAc = 0;
  }
  this.productImages = [];
  this.productImages.push("data:image/jpeg;base64,"+this.productValue.cover_image);
  console.log(this.productImages);
  this.productDetails.details.images.forEach(element => {
    this.productImages.push("data:image/jpeg;base64,"+element.url);
  });
  console.log(this.productImages);
 // let urlimages:any[] = [];
  // this.productImages.forEach(element => {
  //   element.url = this.URL+element.url;
  //   urlimages.push(element);
  // });
  // this.productImages = urlimages;
  //this.initCarData()
  //console.log(this.productDetails);
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
    // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
    miniHirePeriod: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    seatNo: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    minHireDistance: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    advanceAmount: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    nonAcPriceHourly: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    nonAcpriceKm: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    acPriceHourly: new FormControl('', [ Validators.pattern(AMOUNTPATTERN)]),
    availableAc: new FormControl('',  Validators.compose([])),
    carId: new FormControl('',  Validators.compose([])),
    acpriceKm: new FormControl('', [ Validators.pattern(AMOUNTPATTERN)])
    
  }); 
}

presentActionSheet() {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'Choose your method',
    buttons: [
      {
        text: 'Take a picture',
        //role: 'destructive',
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
        // this.productImages.push(results[i]);
       // this.imagestring.push("data:image/jpeg;base64,"+results[i]);
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
  this.authService.authData(data,'edit_product_car',this.userPostData.token).then((data) => {
    this.responseData = data;
    if(this.responseData.status == true){
      this.navCtrl.pop();
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
    console.log(src);
    let newimage: any = [];
    this.productImages.forEach(element => {
      if(element != src)
        newimage.push(element);
    });
    console.log(newimage)
    this.productImages = newimage;
  }


// initCarData()
//   {
//     //call rest endpoint and populate the initial data required here
//     //TODO: token to load from local storage
//     this.authService.getData("get_car_details", this.userPostData.token).then((result) => {
//       this.responseData = result;
//       this.carbrands = [];
//       this.responseData.brands.forEach(element => {
//         console.log(element);
//         this.carbrands.push(element);
//       });

//       this.cartypes = [];
//       this.responseData.types.forEach(element => {
//         this.cartypes.push({type:element.type, id: element.id});
//       });

//       this.cartypes.forEach(element => {
//         console.log(element);
//       });
//     },
//     (err) => {
//       this.responseData = err.json();
//       console.log(this.responseData);
//      });

//   }

  // updateModels(brand: {car_company_name:string, id: number})
  // {
  //   console.log(brand);
  //   // this.userData.brandName = brand.id+"";
  //   this.userData.models = null;
  //   // this.errormessage = "";
  //   //TODO: change the token to load from local storage
  //   console.log(brand);
  //   this.authService.getData("get_car_models?id="+brand.id, this.userPostData.token).then((result)=>
  //   {

  //     this.carmodels = [];
  //     this.responseData = result;
  //     this.carModelAvailable = true;
  //     this.responseData.models.forEach(element => {
  //       this.carmodels.push({car_model:element.car_model, model_id: element.model_id});
  //     });
  //   },
  //   (err)=>{
  //     this.responseData = err.json();
  //     console.log(this.responseData);
  //     this.carmodels = [];
  //   }   

  // ); 
  // }
  // storeModel(model: {car_model:string, model_id:number})
  // {
  //   this.userData.models = model.model_id+"";
  //  // this.errormessage = "";
  // }

}