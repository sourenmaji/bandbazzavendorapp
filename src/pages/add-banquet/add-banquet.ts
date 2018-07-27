import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ActionSheetController } from 'ionic-angular';
import { ImagePicker } from '../../../node_modules/@ionic-native/image-picker';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';

/**
 * Generated class for the AddBanquetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-banquet',
  templateUrl: 'add-banquet.html',
})
export class AddBanquetPage {

  @ViewChild('formslides') formSlide: Slides;
  @ViewChild('sliderbubbles') sliderbubbles: Slides;

  public len: number;
  public pageNo: number;
  public slides: any[] = [];
  public errormessage: string;

  //form 4 data
  public images: string[];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public imagePicker: ImagePicker,
              public actionSheetCtrl: ActionSheetController,
              public camera: Camera) {


                
    //for card slide design
    this.pageNo = 0;
    this.len = 1;

    //for step 4
    this.images = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBanquetPage');
  }

  ionViewDidEnter()
  {
    //for form control
    console.log(this.formSlide.length());
    this.len = this.formSlide.length();
    for(var i=0;i< this.len;i++)
    {
      this.slides.push({});
    }

    this.formSlide.lockSwipes(true);
    this.sliderbubbles.lockSwipes(true);
  }

  goToNext()
  {
    if(this.pageNo == 4)
    {
      this.uploadData();
    }
    if(!this.validateStep(this.pageNo+1)) // step number is one more than pageNo, thanks to array base zero
    {
      return;
    }
    this.pageNo++;
    this.formSlide.lockSwipes(false);
    this.formSlide.slideNext();
    this.formSlide.lockSwipes(true);
    this.sliderbubbles.lockSwipes(false);
    this.sliderbubbles.slideNext();
    this.sliderbubbles.lockSwipes(true);
    console.log('moving to next slide');
    if(this.pageNo == this.len)
    this.pageNo = this.len-1;
  }

  goToPrev()
  {
    this.pageNo--;
    this.formSlide.lockSwipes(false);
    this.formSlide.slidePrev();
    this.formSlide.lockSwipes(true);
    this.sliderbubbles.lockSwipes(false);
    this.sliderbubbles.slidePrev();
    this.sliderbubbles.lockSwipes(true);
    console.log('moving to previous slide');
    if(this.pageNo<0)
    this.pageNo = 0;
  }

  validateStep(stepNo: number)
  {
    if(stepNo == 1) 
    {
      return true;
    }
    else if(stepNo == 2) 
    {
      return true;
    }
    else if(stepNo == 3) 
    {
      return true;
    }
    else if(stepNo == 4) 
    {
      return true;
    }
    else
    {
      return false;
    }
  }


  //functions for step 4

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
            this.pickImage();
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
      let remaining = 5 - this.images.length;
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
      this.images.push(imageData);
      //console.log(imageData);
     }, (err) => {
      // Handle error
     });
  }

  pickImage()
  {
    let remaining = 5 - this.images.length;
    if(remaining <= 0)
    {
      return;
    }
    this.imagePicker.getPictures({maximumImagesCount:remaining, quality:10, outputType:1}).then
    (results =>{
      console.log(results);
      for(let i=0; i < results.length;i++){
        this.images.push(results[i]);
      };
    });
  }

  removeImage(src: string)
  {
    let newimageright: string[] = [];
    this.images.forEach(element => {
      if(element != src)
        newimageright.push(element);
    });
    this.images = newimageright;
  }


  
  uploadData()
  {

  }
}
