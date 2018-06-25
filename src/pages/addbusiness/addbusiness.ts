import { BusinessPage } from './../business/business';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, ActionSheetController, ToastController, Platform, LoadingController, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {Http, Headers} from '@angular/http';
declare var cordova: any;

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
  
  constructor(public navCtrl: NavController, private camera: Camera, private transfer: FileTransfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
             public platform: Platform, public loadingCtrl: LoadingController, public authService: AuthServiceProvider, public alertCtrl: AlertController) {

    const dataBusiness = JSON.parse(localStorage.getItem('businessOptions'));
    console.log(dataBusiness);
    this.businessDetails = dataBusiness.options;
    // console.log(dataBusiness.length);
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
   }


  responseData : any;
  

  addBusinessform: FormGroup;
  userData = { phone: "",email: "",companyName: "",address: "",city: "",details: "",businessType: "",filename: ""};
  userPostData = {"user":"","token":""};

  ngOnInit() {
    let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let PHONEPATTERN = /^[0-9]{10}$/;
    this.addBusinessform = new FormGroup({
      // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(PHONEPATTERN)])),
      companyName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      details: new FormControl('', [Validators.required]),
      businessType: new FormControl('', [Validators.required])
    });

    
  }




  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
       
        {
          text: 'Load from Library',
          handler: () => {
            //this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
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
      quality: 100,
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
  
  // addBusiness(){
  //   this.authService.authData(this.userData,'add_business',this.userPostData.token).then((result) => {
  //    this.responseData = result;
  //    if(this.responseData.success)
  //    {
  //    console.log(this.responseData);
  //    localStorage.setItem('userData', JSON.stringify(this.responseData));
  //    console.log("Local storage "+JSON.parse(localStorage.getItem('userData')));
  //    const alert = this.alertCtrl.create({
  //     subTitle: this.responseData.success.message,
  //     buttons: ['OK']
  //   })
  //   alert.present();
  //    }
  //    else{ console.log(this.responseData.error); }
  //  }, (err) => {
  //   this.responseData = err.json();
  //   console.log(this.responseData)
  //   const alert = this.alertCtrl.create({
  //     subTitle: this.responseData.error,
  //     buttons: ['OK']
  //   })
  //   alert.present();
  //  });
  // }

  uploadImage(){
    var targetPath = this.pathForImage(this.lastImage);
    var data = this.userData;
    data.filename = this.lastImage;
    let headers = new Headers();
      // headers.append('Accept','application/json');
      headers.append('Authorization','Bearer '+ this.userPostData.token);
      console.log(headers);
    let options: FileUploadOptions = {
     fileKey: "file",
     fileName: data.filename,
     chunkedMode: false,
     mimeType: "multipart/form-data",
     // params : {'fileName': filename, 'data': this.userData}
     params : data,
     headers: {'Authorization': 'Bearer '+ this.userPostData.token}
   };
   this.authService.uploadImage(options, targetPath, 'add_business').then((result) => {
    this.responseData = result;
    var dataObj = (this.responseData);
      alert("Result "+this.responseData);
      alert("ResultObj "+dataObj.businesses); 
    alert("last"+this.responseData.businesses);
   // console.log(this.responseData);
    localStorage.setItem('businessData', dataObj.businesses);
    const data = localStorage.getItem('businessData');
    alert("value in local storage"+ data);
   // console.log("Local storage "+JSON.parse(localStorage.getItem('businessData')));
    this.navCtrl.pop();
    
  }
  , 
  (err) => {
   this.responseData = err;
   
   const alert = this.alertCtrl.create({
    subTitle: this.responseData.message,
    buttons: ['OK']
  })
  alert.present();
  });
  
 }
  }
  // public uploadImage() {
  //   // Destination URL
  //   var url = "http://192.168.0.129/BandBazza/public/api/add_business";
   
  //   // File for Upload
  //   var targetPath = this.pathForImage(this.lastImage);
   
  //   // File name only
    
  //   var data = this.userData;
  //    data.filename = this.lastImage;
  //   var options = {
  //     fileKey: "file",
  //     fileName: data.filename,
  //     chunkedMode: false,
  //     mimeType: "multipart/form-data",
  //     // params : {'fileName': filename, 'data': this.userData}
  //     params : { data}
  //   };
  //   console.log(options);
  //   const fileTransfer: FileTransferObject = this.transfer.create();
   
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Uploading...',
  //   });
  //   this.loading.present();
   
  //   // Use the FileTransfer to upload the image
  //   fileTransfer.upload(targetPath, url, options).then(data => {
  //     this.loading.dismissAll()
  //     this.presentToast('Image succesful uploaded.');
  //   }, err => {
  //     this.loading.dismissAll()
  //     this.presentToast('Error while uploading file.');
  //   });
  // }
