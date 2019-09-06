import { MapsAPILoader } from '@agm/core';
import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ActionSheetController, IonicPage, LoadingController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';

declare var cordova: any;
declare var google;
@IonicPage()
@Component({
  selector: 'page-editbusiness',
  templateUrl: 'editbusiness.html',
})
export class EditbusinessPage {
  business :  any;
  userDetails : any;
  imagePath: string = null;
  imageChanged: boolean = false;
  responseData: any = null;
  autocomplete: any;
  editBusinessform: FormGroup;
  userData = { phone: "",email: "",companyName: "",address: "",city: "",details: "",businessType: "",file: "", business_id: "",lat: "", lng: ""};
  userPostData = {"user":"","token":""};
  loader: any;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public imagePicker: ImagePicker,
              public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              private camera: Camera,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              private authService: AuthServiceProvider
              ) {

  this.business = this.navParams.get('business');
  this.imagePath = this.authService.imageUrl+this.business.business_image;

  this.userData.address = "";
  this.userData.lat = "";
  this.userData.lng = "";

  const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.user;
    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.token;
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2);

    this.authService.pageReset=false;
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  }

  ionViewDidEnter()
  {
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
    this.editBusinessform = new FormGroup({
      phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(PHONEPATTERN)])),
      companyName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      details: new FormControl('', [Validators.required]),
      businessType: new FormControl({ value: '', disabled: true }),
      lat: new FormControl('', [Validators.required]),
      lng: new FormControl('', [Validators.required]),
      business_id: new FormControl('', Validators.compose([]))
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
    this.imageChanged = true;
   }, (err) => {
    this.imageChanged = false;
    // Handle error
    this.presentToast(err);
   });
}

  pickImage()
  {
    this.imagePicker.getPictures({maximumImagesCount:1, quality:60, outputType:1}).then
    (results =>{
      this.imagePath = results[0];
      this.imageChanged = true;
    }, (err) => {
      this.imageChanged = false;
      // Handle error
      this.presentToast(err);
     });
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

  saveEditProfile() {
    this.loader.present();
      if(this.imageChanged) {
        this.userData.file=this.imagePath;
      } else {
        this.userData.file="";
      }
     
      this.authService.authData(this.userData,'edit_business',this.userPostData.token).then((data) => {
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
