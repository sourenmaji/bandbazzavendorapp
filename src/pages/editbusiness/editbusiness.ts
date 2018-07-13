import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { BusinessPage } from './../business/business';
import { FileUploadOptions, FileTransferObject, FileTransfer, FileUploadResult } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, AlertController } from 'ionic-angular';
declare var cordova: any;
let apiUrl = 'http://192.168.0.130/BandBazza/public/api/';
@IonicPage()
@Component({
  selector: 'page-editbusiness',
  templateUrl: 'editbusiness.html',
})
export class EditbusinessPage {
  business :  any;
  lastImage: string = null;
  businessImage: any;
  businessImageSrc: any;
  targetPath = "";
  result : FileUploadResult = null;
  responseData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController,private camera: Camera, public platform: Platform ,private filePath: FilePath,
    private file: File, private alertCtrl: AlertController, private transfer: FileTransfer,private authService: AuthServiceProvider) {

    this.business = this.navParams.get('business');
  this.businessImage = this.business.business_image;
  this.businessImageSrc = "http://192.168.0.130/BandBazza/public/"+this.businessImage;
    
  }
 editBusinessform: FormGroup;
  userData = { phone: "",email: "",companyName: "",address: "",city: "",details: "",businessType: "",filename: ""};
  userPostData = {"user":"","token":""};

  ngOnInit() {
    let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let PHONEPATTERN = /^[0-9]{10}$/;
    this.editBusinessform = new FormGroup({
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
      this.businessImageSrc = this.pathForImage(this.lastImage);
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

  saveEditProfile(){
    //alert(this.targetPath);
    this.targetPath = this.pathForImage(this.lastImage);
    var data = this.userData;
    if(this.targetPath != ""){
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
      fileTransfer.upload(this.targetPath, apiUrl+'edit_business', options).then((data) => {
        // Success!
        alert('success')
        this.result = data;
        //alert(this.result.response);
        var success = JSON.parse(this.result.response);
       // alert(success.status);
        if(success.status===true){
        //localStorage.setItem('businessData', success.businesses);
        const alert = this.alertCtrl.create({
          subTitle: success.message,
          buttons: ['OK']
          
        })
        alert.present();
        this.navCtrl.pop();
        //this.navCtrl.push(BusinessPage);
        //this.navCtrl.remove(this.navCtrl.length()-1);
        }else{
          const alert = this.alertCtrl.create({
            subTitle: success.message,
            buttons: ['OK']
            
          })
          alert.present();
          this.navCtrl.pop();
        }
       
      },
      (err) => {
        // Error
        //alert('error! Try again')
        //alert(err.body);
        var error = JSON.parse(err.body);
        //alert(error.status);
        const alert = this.alertCtrl.create({
          subTitle: error.message,
          buttons: ['OK']
          
        })
        alert.present();
        // if(error.status==false){
        // this.navCtrl.push(BusinessPage);
        // this.navCtrl.remove(this.navCtrl.length()-1);
        // }
      }); 
    }
    else{
      this.authService.authData(this.userData,'edit_business',this.userPostData.token).then((data) => {
        this.responseData = data;
        if(this.responseData.status===true)
        {
          //localStorage.setItem('businessData', this.responseData.businesses);
          const alert = this.alertCtrl.create({
            subTitle: this.responseData.message,
            buttons: ['OK']
            
          })
          alert.present();
          this.navCtrl.pop();
        }else{
          const alert = this.alertCtrl.create({
            subTitle: this.responseData.message,
            buttons: ['OK']
            
          })
          alert.present();
          this.navCtrl.pop();
        }
      }, (err) => {
       this.responseData = err.json();
       console.log(this.responseData)
       const alert = this.alertCtrl.create({
         subTitle: this.responseData.message,
         buttons: ['OK']
       })
       alert.present();
      });
    }
  }
}
