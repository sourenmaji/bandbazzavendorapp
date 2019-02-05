import { MapsAPILoader } from '@agm/core';
import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/file-transfer';
import { ActionSheetController, IonicPage, LoadingController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Base64 } from '@ionic-native/base64';
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
  lastImage: string = null;
  businessImage: any;
  businessImageSrc: any;
  targetPath = "";
  result : FileUploadResult = null;
  responseData: any;
  apiUrl: string = '';
  autocomplete: any;
  editBusinessform: FormGroup;
  userData = { phone: "",email: "",companyName: "",address: "",city: "",details: "",businessType: "",filename: "", business_id: "",lat: "", lng: ""};
  userPostData = {"user":"","token":""};

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              private camera: Camera,
              public platform: Platform,
              private filePath: FilePath,
              private file: File,
              public loadingCtrl: LoadingController,
              private transfer: FileTransfer,
              private authService: AuthServiceProvider,
              private base64: Base64,
              private sanitizer: DomSanitizer) {

  this.business = this.navParams.get('business');
  this.businessImage = this.business.business_image;
  this.apiUrl = this.authService.apiUrl;
  this.businessImageSrc = this.authService.imageUrl+this.businessImage;
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
    console.log(this.business.module_name);
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
      let image = this.pathForImage(this.lastImage);
      this.base64.encodeFile(image).then((base64File: string) => {
        console.log('base64', base64File);
        this.businessImageSrc = this.sanitizer.bypassSecurityTrustUrl(base64File);
        console.log('imagePath', this.businessImageSrc);
      }, (err) => {
        console.log('error ',err);
      });
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    console.log('img1 '+img);
    if (img === null) {
      return '';
    } else {
      let path=cordova.file.dataDirectory;
      console.log('path '+path);
      path=path.split("://", 2)[1];
      console.log(path+img)
      return path+img;
    }
  }

  saveEditProfile(){

    this.targetPath = this.pathForImage(this.lastImage);
    var data = this.userData;
    if(this.targetPath != "")
    {
      console.log("file");
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
      fileTransfer.upload(this.targetPath, this.apiUrl+'edit_business', options).then((data) => {

        this.result = data;
        console.log(this.result);
        var success = JSON.parse(this.result.response);
        console.log(success);
          const toast = this.toastCtrl.create({
            message: success.message,
            duration: 5000,
            position: 'bottom'
          })
          toast.present();

          this.navCtrl.pop();
          this.authService.pageReset=true;
      },
      (err) => {

        // Error
        var error = JSON.parse(err.body);
        const toast = this.toastCtrl.create({
          message: error.message,
          duration: 5000,
          position: 'bottom'
        })
        toast.present();
      });
    }
    else
    {
      console.log("no file");

      this.authService.authData(this.userData,'edit_business',this.userPostData.token).then((data) => {

        this.responseData = data;
        console.log(this.responseData);
        const toast = this.toastCtrl.create({
          message: this.responseData.message,
          duration: 5000,
          position: 'bottom'
        })
        toast.present();
        if(this.responseData.status)
        {
        this.navCtrl.pop();
        this.authService.pageReset=true;
        }
      },
      (err) => {

       this.responseData = err;
       console.log(this.responseData);
       const toast = this.toastCtrl.create({
        message: 'Oops! Something went wrong.',
        duration: 5000,
        cssClass: "toast-danger",
        position: 'bottom'
      })
      toast.present();
      });

    }
  }
}
