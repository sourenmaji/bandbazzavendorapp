import { MapsAPILoader } from '@agm/core';
import { BusinessPage } from './../business/business';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, ActionSheetController, ToastController, Platform, LoadingController, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Headers} from '@angular/http';
declare var cordova: any;
declare var google;

@IonicPage()
@Component({
  selector: 'page-addbusiness',
  templateUrl: 'addbusiness.html',
})
export class AddbusinessPage {
  lastImage: string = null;
  loading: Loading;
  businessDetails : any;
  userDetails : any;
  apiUrl: string = '';
  result : FileUploadResult = null;
  addBusinessform: FormGroup;
  userData = { phone: "",email: "",companyName: "",address: "",city: "",details: "",businessType: "",filename: "",lat: "",lng: ""};
  userPostData = {"user":"","token":""};
  autocomplete: any;

  constructor(public navParams: NavParams,public navCtrl: NavController, private camera: Camera, private transfer: FileTransfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
    private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, public platform: Platform, public loadingCtrl: LoadingController, public authService: AuthServiceProvider, public alertCtrl: AlertController) {

    const dataBusiness  = this.navParams.data;
    console.log(dataBusiness);
    this.businessDetails = dataBusiness.options;
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;
    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
    this.apiUrl=this.authService.apiUrl;
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2);
    this.userData.address = "";
    this.userData.lat = "";
    this.userData.lng = "";

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

  autolocation()
  {
    console.log("keyup");
    this.userData.address = "";
    this.userData.lat = "";
    this.userData.lng = "";
    this.mapsAPILoader.load().then(() => {
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


  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [

        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
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

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 60,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }


  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  uploadImage(){
    var targetPath = this.pathForImage(this.lastImage);
    var data = this.userData;
    data.filename = this.lastImage;
    let headers = new Headers();
    headers.append('Authorization','Bearer '+ this.userPostData.token);
    console.log(headers);
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: data.filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : data,
      headers: {'Authorization': 'Bearer '+ this.userPostData.token}
    };

    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.upload(targetPath, this.apiUrl+'add_business', options).then((data) => {
      // Success!
     // alert('success')
      this.result = data;
     // alert(this.result.response);
      var success = JSON.parse(this.result.response);
      if(success.status===true){
      localStorage.setItem('businessData', success.businesses);
      const alert = this.alertCtrl.create({
        subTitle: 'Business added successfully',
        buttons: ['OK']

      })
      alert.present();
      this.navCtrl.pop();
      }

    },
    (err) => {
      var error = JSON.parse(err.body);
      if(error.status==false){
      this.navCtrl.push(BusinessPage);
      this.navCtrl.remove(this.navCtrl.length()-1);
      }
    });
  }
  }
