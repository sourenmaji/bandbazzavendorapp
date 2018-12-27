import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CustomValidator } from '../../validators/custom-validators';
import { ImagePicker } from '../../../node_modules/@ionic-native/image-picker';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';

@IonicPage()
@Component({
  selector: 'page-add-photo-plan',
  templateUrl: 'add-photo-plan.html',
})
export class AddPhotoPlanPage {
  module: string="";
  addPlanForm: FormGroup;
  addVideoForm: FormGroup;
  responseData: any;
  token: string;
  images: any[]=[];
  file_uri: any[]=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public restServ: AuthServiceProvider,
    private toastCtrl: ToastController,
    public imagePicker: ImagePicker,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public base64: Base64
  ) {
    console.log(this.navParams.data)
    this.module=this.navParams.get('module');
    console.log(this.images);

    this.restServ.pageReset=false;
    console.log("cons");

    this.addPlanForm = this.formBuilder.group({
      photographer_id: [this.navParams.get('id')],
      plan_name: ['',Validators.required],
      plan_price: ['',Validators.required],
      plan_offers: ['',Validators.required]
    });
    let url_pattern=/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/;
    this.addVideoForm = this.formBuilder.group({
      photographer_id: [this.navParams.get('id')],
      video_link: ['',Validators.compose([Validators.pattern(url_pattern), Validators.required])],
    });
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.token;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPhotoPlanPage');
  }

  ionViewDidEnter() {
    this.images=[];
    this.file_uri=[];
    console.log('ionViewDidEnter AddPhotoPlanPage');
  }

  addPlan()
  {
    console.log(this.addPlanForm.value);
    this.restServ.authData(this.addPlanForm.value,'add_photography_plan',this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);
      let toast = this.toastCtrl.create({
        message: this.responseData.message,
        duration: 2000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        if(this.responseData.status==true)
        {
          this.restServ.pageReset=true;
          this.navCtrl.pop();
        }
      });

      toast.present();
    }, (err) => {

     console.log(err);
     let toast = this.toastCtrl.create({
      message: 'Something went wrong! Please try again.',
      duration: 2000,
      position: 'top'
    });
    toast.present();
    });
  }

  addVideo()
  {
    console.log(this.addVideoForm.get('video_link'));
    let url_pattern=/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/;
    let video_link=this.addVideoForm.get('video_link').value;
    console.log(video_link);
    var match = video_link.match(url_pattern);
    console.log(match);
      if(match && match[5].length == 11)
      {
        this.addVideoForm.get('video_link').setValue('https://www.youtube.com/embed/' + match[5] + '?autoplay=0');
        console.log("normal");
      }
      this.restServ.authData(this.addVideoForm.value,'add_photography_video',this.token).then((data) => {
        this.responseData = data;
        console.log(this.responseData);
        let toast = this.toastCtrl.create({
          message: this.responseData.message,
          duration: 2000,
          position: 'top'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
          if(this.responseData.status==true)
          {
            this.restServ.pageReset=true;
            this.navCtrl.pop();
          }
        });

        toast.present();
      }, (err) => {

       console.log(err);
       let toast = this.toastCtrl.create({
        message: 'Something went wrong! Please try again.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
      });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose your method',
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
            this.SelectFromGallery();
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
    const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };
  this.camera.getPicture(options).then((imageData) => {
    this.file_uri.push(imageData);
    alert('file '+this.file_uri);
      this.base64.encodeFile(imageData).then((base64File: string) => {
        this.images.push(base64File);
      }, (err) => {
        alert('base64 '+err);
      });
    }, (err) => {
      alert('error '+err);
    });

}

SelectFromGallery()
{
  this.imagePicker.getPictures({maximumImagesCount:5, quality:70, outputType:0}).then(results =>{
    alert('file '+this.file_uri);
    for(let i=0; i < results.length; i++){
      this.file_uri.push(results[i]);
      this.base64.encodeFile(results[i]).then((base64File: string) => {
        this.images.push(base64File);
      }, (err) => {
        alert('base64 '+err);
      });
    }
  },
  (err) => {
    alert('error '+err);
  });
}

removeImage(src: string)
{
  let newimages: string[] = [];
  this.file_uri.forEach(element => {
    if(element != src)
    newimages.push(element);
  });
  this.file_uri = newimages;
}

UploadImages()
{
  alert(this.images);
  this.restServ.authData({images: this.images, photographers_id: this.navParams.get('id')},'add_photography_image',this.token).then((data) => {
    this.responseData = data;
    console.log(this.responseData);
    let toast = this.toastCtrl.create({
      message: this.responseData.message,
      duration: 2000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      if(this.responseData.status==true)
      {
        this.restServ.pageReset=true;
        this.navCtrl.pop();
      }
    });

    toast.present();
  }, (err) => {

   console.log(err);
   let toast = this.toastCtrl.create({
    message: 'Something went wrong! Please try again.',
    duration: 2000,
    position: 'top'
  });
  toast.present();
  });

}
}
