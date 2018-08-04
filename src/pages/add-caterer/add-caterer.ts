import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ActionSheetController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ImagePicker } from '../../../node_modules/@ionic-native/image-picker';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-add-caterer',
  templateUrl: 'add-caterer.html',
})
export class AddCatererPage {

  public token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjA1MWNkNzUyZjhjZWUzY2Q0MmQzNzAzY2ExOGZkZmU4NDc0NmJlMzBiNzI3ZmM2ZWNkZTYyN2ExNWNmMzI5ODRjYjA2NzY2YjI2ZTk2YzE0In0.eyJhdWQiOiIxIiwianRpIjoiMDUxY2Q3NTJmOGNlZTNjZDQyZDM3MDNjYTE4ZmRmZTg0NzQ2YmUzMGI3MjdmYzZlY2RlNjI3YTE1Y2YzMjk4NGNiMDY3NjZiMjZlOTZjMTQiLCJpYXQiOjE1MzE5ODY1OTEsIm5iZiI6MTUzMTk4NjU5MSwiZXhwIjoxNTYzNTIyNTkxLCJzdWIiOiIzIiwic2NvcGVzIjpbXX0.AqYVcs-YCspA2pyteHvB9jsh18aX8qaJzmlq9oUuXb0PJ_zUwj272itEKscJ4LhMlApt9GhrCtdTEK-90MVMbDVXp1z7kj_Mg9wzULyXVpdj9xQUwkRZsLcINLqpHgrsleZcUuNcuwKiibVLMjRcJ5Jz_eOnbr4E62UxQVUkOjVzEciAjucdI73FepK5HjOaEmW4qjxuxtbO8zeVotQn42yWDsTtRqL8-GNBn4MT2lQuMMS9m89SioVD4WHbSeAURMd1gQbiju1xSqmzUc7rDnNUniIhVQYkmmm39zbCJ2hQlfvTC1CCWz6i-h18AXbKvdSqauRlBIodHklV3mvgqyhkKHFn7EOCf8FUEpTJrwMJVGKuEa8iuCMJnYe7dBvAdqXp-CjgcoD2jiCU6GhilmzTmP2Ec2g-K18Wu4t2aPZlTOoFUpQd6P_P3m7kFn7Dv8Z_UKrJk-mLZA1KV5EfX-QYn95pM0sB3Pqjg-6xllFa8qk9ZdSeDRY8ZN7-23ye1J5-v2GQ3b0m5Mm8cqN0WGzVyma5PkIah7ioBgFN9co6QOdDh_SfHdN_Y74bQdzp2LI97h02O0YQQRYu7z_eBD1FEgzxMzj2CSOs3Z9zl3noLjd1T8mF6A-3qx89dPBZ84WE5SpTaLrSXh7V4hVeLyXZbuBnZ3C7g2ogvt0-W3I";
  @ViewChild('formslides') formSlide: Slides;
  @ViewChild('sliderbubbles') sliderbubbles: Slides;
  public len: number;
  public pageNo: number;
  public slides: any[] = [];
  public errormessage: string;
  public business_id: number;
  public responseData: any;

  //for step 1
  public step1data:{packagename:string, veg: boolean};

  //for step 2
  public step2data:{start_price:number, min_no_plates: number, tags:string};

  //for step 3
  public imagesleft: string[];
  public imagesright: string[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restServ: AuthServiceProvider,
              public imagePicker: ImagePicker,
              public actionSheetCtrl: ActionSheetController,
              public camera: Camera,
              private alertCtrl: AlertController
            ) {
    //for card slide design
    this.pageNo = 0;
    this.len = 1;
    //for step 1
    this.step1data = {packagename:"", veg:null};
    //for step 2
    this.step2data = {start_price:null, min_no_plates:null, tags:""};
    //for step 3
    this.imagesright = [];
    this.imagesleft = [];

    this.business_id=this.navParams.data;

    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCatererPage');
    //console.log(this.formSlide.length);
  }

  ngOnInit()
  {
    //this.formstep1 = new FormGroup({
    //pkgnm: new FormControl("", [Validators.required, Validators.minLength(3)])
    //}
    //);
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
    if(this.pageNo == 3)
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
  // the methods below pertains to form step 1/4


  validateStep(stepNo: number)
  {
    if(stepNo == 1) //this is step 1, check if user has entered a package name
    {
      if(this.step1data.packagename == "")
      {
        this.errormessage = "Enter a package name!";
        return false;
      }
        else if (this.step1data.packagename.length < 4)
        {
          this.errormessage = "Package name is short! (should be greater than 4 characters)"
          return false;
        }
        else if(this.step1data.veg == null)
        {
          this.errormessage = "Choose a package type!";
          return false;
        }
        else
        {
          this.errormessage = "";
          return true;
        }
    }
    else if(stepNo == 2)
    {
      if(this.step2data.min_no_plates == null || this.step2data.min_no_plates<0)
      {
        this.errormessage = "Enter valid 'minimum no. of plates'";
        return false;
      }
      else if(this.step2data.start_price == null || this.step2data.start_price<=0)
      {
        this.errormessage = "Enter a valid starting price for this package!";
        return false;
      }
      // else if(this.step2data.tags.trim() == "")
      // {
      //   this.errormessage = "Please enter tags to identify your products";
      //   return false;
      // }
      return true;
    }
    // else if(stepNo == 3)
    // {
    //   let min_required_images = 1;
    //   if(this.imagesleft.length+this.imagesright.length> min_required_images)
    //   return true;
    // }
    return false;
  }

  //funtions for step 3

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
      let remaining = 5 - this.imagesleft.length - this.imagesright.length;
      if(remaining <= 0)
      {
        return;
      }
      const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      if(this.imagesright.length< this.imagesleft.length)
          this.imagesright.push(imageData);
        else
          this.imagesleft.push(imageData);
      //console.log(imageData);
     }, (err) => {
      // Handle error
     });
  }

  pickImage()
  {
    let remaining = 5 - this.imagesleft.length - this.imagesright.length;
    if(remaining <= 0)
    {
      return;
    }
    this.imagePicker.getPictures({maximumImagesCount:remaining, quality: 60, outputType:1}).then
    (results =>{
      console.log(results);
      for(let i=0; i < results.length;i++){
        if(this.imagesright.length< this.imagesleft.length)
          this.imagesright.push(results[i]);
        else
          this.imagesleft.push(results[i]);
      };
    });
  }

  removeImage(src: string)
  {
    let newimageright: string[] = [];
    let newimageleft: string[] = [];
    this.imagesright.forEach(element => {
      if(element != src)
        newimageright.push(element);
    });
    this.imagesleft.forEach(element => {
      if(element != src)
        newimageleft.push(element);
    });
    this.imagesright = newimageright;
    this.imagesleft = newimageleft;
  }

  //
  uploadData()
  {
    let dataCaterer:any = {};
    dataCaterer.business_id = this.business_id;
    dataCaterer.package_name = this.step1data.packagename;
    if(this.step1data.veg)
      dataCaterer.is_veg = 1;
    else
      dataCaterer.is_veg = 0;
    dataCaterer.price_per_plate = this.step2data.start_price;
    dataCaterer.package_min_plates = this.step2data.min_no_plates;
    dataCaterer.package_tags = this.step2data.tags;
    dataCaterer.images = [];
    this.imagesright.forEach(element => {
      dataCaterer.images.push(element);
    });
    this.imagesleft.forEach(element => {
      dataCaterer.images.push(element);
    });

    // upload dataCaterer to server
    console.log(dataCaterer);
    alert(dataCaterer);
    //call the rest here..
    this.restServ.authData(dataCaterer,'add_product_package',this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);
      if(this.responseData.status==true)
      {
        this.navCtrl.pop();
        const alert = this.alertCtrl.create({
        subTitle: this.responseData.message,
        buttons: ['OK']
        
      })
      alert.present();
      }
      else
      {
      const alert = this.alertCtrl.create({
        subTitle: this.responseData.message,
        buttons: ['OK']
      })
      alert.present();
      }
      
    }, (err) => {
     this.responseData = err;
     console.log(this.responseData)
     const alert = this.alertCtrl.create({
      subTitle: "Something went wrong! Please try again.",
      buttons: ['OK']
    })
    alert.present();
    });
  }
}
