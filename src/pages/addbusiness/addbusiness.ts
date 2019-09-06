import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ActionSheetController, AlertController, IonicPage, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MapsAPILoader } from '@agm/core';

declare var cordova: any;
declare var google;

@IonicPage()
@Component({
  selector: 'page-addbusiness',
  templateUrl: 'addbusiness.html',
})
export class AddbusinessPage {
  lastImage: string = null;
  imagePath: string;
  businessDetails : any;
  userDetails : any;
  apiUrl: string = '';
  responseData : any = null;
  addBusinessform: FormGroup;
  userData = { phone: "",email: "",companyName: "",address: "",city: "",details: "",businessType: "",file: "",lat: "",lng: ""};
  userPostData = {"user":"","token":""};
  autocomplete: any;
  loader: any;

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              private camera: Camera,
              public imagePicker: ImagePicker,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public authService: AuthServiceProvider,
              public alertCtrl: AlertController) {

    const dataBusiness  = this.navParams.data;
    console.log(dataBusiness);
    this.businessDetails = dataBusiness.options;
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.user;
    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.token;
    this.apiUrl=this.authService.apiUrl;
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2);
    this.userData.address = "";
    this.userData.lat = "";
    this.userData.lng = "";
    this.authService.pageReset=false;
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
   }

   ionViewDidEnter(){
    const dataBusiness  = this.navParams.data;
    console.log(dataBusiness);
    this.businessDetails = dataBusiness.options;
    this.mapsAPILoader.load().then(() => {
      let nativeHomeInputBox = document.getElementById('city').getElementsByTagName('input')[0];
      console.log(nativeHomeInputBox);
      this.autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
          types: ["geocode"],componentRestrictions: {country: 'in'}
      });
      console.log(this.autocomplete);
      });
   }


  ngOnInit() {
    let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let PHONEPATTERN = /^[0-9]{10}$/;
    this.addBusinessform = new FormGroup({
      phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(PHONEPATTERN)])),
      companyName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      details: new FormControl('', [Validators.required]),
      businessType: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required]),
      lng: new FormControl('', [Validators.required])
    });
  }

  presentToast(msg) {
     let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  autolocation()
  {
    this.mapsAPILoader.load().then(() => {
      console.log("keyup");
      this.userData.address = "";
      this.userData.lat = "";
      this.userData.lng = "";
      this.autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
              //get the place result
              let place: any = this.autocomplete.getPlace();

              //verify result
              if (!place.geometry) {
                console.log('place not found');
                return;

              }
              //set latitude, longitude and zoom
              this.userData.city = place.formatted_address;
              this.userData.address = place.formatted_address;
              this.userData.lat = place.geometry.location.lat();
              this.userData.lng = place.geometry.location.lng();
          });
      });
  });
  }

  chooseFromCam(){
    const options: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  this.camera.getPicture(options).then((imageData) => {
    this.imagePath = imageData;
   }, (err) => {
    // Handle error
    this.presentToast(err);
   });
}

  pickImage()
  {
    this.imagePicker.getPictures({maximumImagesCount:1, quality:60, outputType:1}).then
    (results =>{
      this.imagePath = results[0];
    }, (err) => {
      // Handle error
      this.presentToast(err);
     });
  }

  removeImage()
  {
    this.imagePath=null;
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.chooseFromCam();
          }
        },
        {
          text: 'Select from gallery',
          handler: () => {
            this.pickImage();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  addBusiness(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loader.present();
      this.userData.file=this.imagePath;
      this.authService.authData(this.userData,'add_business',this.userPostData.token).then((data) => {
      this.loader.dismiss();
      this.responseData = data;

      if(this.responseData.status==true)
      {
          this.navCtrl.pop();
          this.authService.pageReset=true;
          this.presentToast(this.responseData.message);
      }
    },
    (err) => {
      this.loader.dismiss();
        this.navCtrl.pop();
        this.presentToast(err.message);
    });
  }
  }
