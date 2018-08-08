import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ActionSheetController, AlertController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-view-product-banquate',
  templateUrl: 'view-product-banquate.html',
})
export class ViewProductBanquatePage implements OnInit{
  @ViewChild(Slides) slides: Slides;
  //public token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjA1MWNkNzUyZjhjZWUzY2Q0MmQzNzAzY2ExOGZkZmU4NDc0NmJlMzBiNzI3ZmM2ZWNkZTYyN2ExNWNmMzI5ODRjYjA2NzY2YjI2ZTk2YzE0In0.eyJhdWQiOiIxIiwianRpIjoiMDUxY2Q3NTJmOGNlZTNjZDQyZDM3MDNjYTE4ZmRmZTg0NzQ2YmUzMGI3MjdmYzZlY2RlNjI3YTE1Y2YzMjk4NGNiMDY3NjZiMjZlOTZjMTQiLCJpYXQiOjE1MzE5ODY1OTEsIm5iZiI6MTUzMTk4NjU5MSwiZXhwIjoxNTYzNTIyNTkxLCJzdWIiOiIzIiwic2NvcGVzIjpbXX0.AqYVcs-YCspA2pyteHvB9jsh18aX8qaJzmlq9oUuXb0PJ_zUwj272itEKscJ4LhMlApt9GhrCtdTEK-90MVMbDVXp1z7kj_Mg9wzULyXVpdj9xQUwkRZsLcINLqpHgrsleZcUuNcuwKiibVLMjRcJ5Jz_eOnbr4E62UxQVUkOjVzEciAjucdI73FepK5HjOaEmW4qjxuxtbO8zeVotQn42yWDsTtRqL8-GNBn4MT2lQuMMS9m89SioVD4WHbSeAURMd1gQbiju1xSqmzUc7rDnNUniIhVQYkmmm39zbCJ2hQlfvTC1CCWz6i-h18AXbKvdSqauRlBIodHklV3mvgqyhkKHFn7EOCf8FUEpTJrwMJVGKuEa8iuCMJnYe7dBvAdqXp-CjgcoD2jiCU6GhilmzTmP2Ec2g-K18Wu4t2aPZlTOoFUpQd6P_P3m7kFn7Dv8Z_UKrJk-mLZA1KV5EfX-QYn95pM0sB3Pqjg-6xllFa8qk9ZdSeDRY8ZN7-23ye1J5-v2GQ3b0m5Mm8cqN0WGzVyma5PkIah7ioBgFN9co6QOdDh_SfHdN_Y74bQdzp2LI97h02O0YQQRYu7z_eBD1FEgzxMzj2CSOs3Z9zl3noLjd1T8mF6A-3qx89dPBZ84WE5SpTaLrSXh7V4hVeLyXZbuBnZ3C7g2ogvt0-W3I";
  responseData: any;
  productDetails: any;
  requestType: any;
  productImages: any[]=[];
  lat: any;
  log: any;
  URL = 'http://www.bandbazza.com/';
 editProductform: FormGroup;
 userData = {banquetId: "", hallPrice: "",advanceAmount: "",capacity: "",acCharges: "",availableAc: 0,foodType: 0, images: []};
 userPostData = {"user":"","token":""};

  constructor(public navCtrl: NavController, public navParams: NavParams,public imagePicker: ImagePicker,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera, public authService: AuthServiceProvider, public alertCtrl: AlertController) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userPostData.token = data.success.token;
  this.productDetails = this.navParams.get('productDetails');
  this.requestType = this.navParams.get('requestType');
  this.lat = this.productDetails.details.lat;
  this.log = this.productDetails.details.lng;
  this.productImages = [];
  this.productImages.push("data:image/jpeg;base64,"+this.productDetails.details.view);

  //this.productImages = this.productDetails.details.images;
this.productDetails.details.images.forEach(element => {
    this.productImages.push("data:image/jpeg;base64,"+element.url);
  });
  // let urlimages:any[] = [];
  // this.productImages.forEach(element => {
  //   element.url = this.URL+element.url;
  //   urlimages.push(element);
  // });
  // this.productImages = urlimages;

  console.log(this.productDetails);
  this.userData.availableAc= this.productDetails.details.is_ac;
  this.userData.foodType = this.productDetails.details.is_nonveg;
  console.log(this.userData.availableAc);

  
 
}
ionViewDidLoad(){
  this.lat = this.productDetails.details.lat;
  this.log = this.productDetails.details.lng;
  // this.loadMap(this.lat,this.log);
}




ngOnInit() {
  let AMOUNTPATTERN = /^[0-9]/;
  this.editProductform = new FormGroup({
    // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
    // banquetName: new FormControl('', Validators.compose([Validators.required])),
    hallPrice: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    advanceAmount: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    capacity: new FormControl('', [Validators.required, Validators.pattern(AMOUNTPATTERN)]),
    acCharges: new FormControl('', [Validators.pattern(AMOUNTPATTERN)]),
    availableAc: new FormControl('',  Validators.compose([])),
    foodType: new FormControl('',  Validators.compose([])),
    banquetId: new FormControl('',  Validators.compose([]))
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
      // alert(this.productImages);
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
  this.imagePicker.getPictures({maximumImagesCount:remaining, quality:10, outputType:1}).then
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
  this.authService.authData(data,'edit_product_banquet',this.userPostData.token).then((data) => {
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
    let newimage: any = [];
    this.productImages.forEach(element => {
      if(element != src)
        newimage.push(element);
    });
    this.productImages = newimage;
  }

}
