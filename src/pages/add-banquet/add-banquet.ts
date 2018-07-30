import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ActionSheetController } from 'ionic-angular';
import { ImagePicker } from '../../../node_modules/@ionic-native/image-picker';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';
import { FormControl } from '../../../node_modules/@angular/forms';
//import {FormControl} from "@angular/forms";
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

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

  //form 1 data
  public form1data: {hallname:string, details:string, price:number, booking_advance: number};

  //form 2 data
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  
  @ViewChild("search")
  public searchElementRef;
  public form2data:{full_address, lat, long, same_as_business:boolean, map_address:string};

  //form 3 data
  public form3data: {capacity:number, all_food_type:boolean, ac:boolean, parking:boolean};
  //form 4 data
  public images: string[];

  public temp;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public imagePicker: ImagePicker,
              public actionSheetCtrl: ActionSheetController,
              public camera: Camera,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone
            ) {


                
    //for card slide design
    this.pageNo = 0;
    this.len = 1;

    //for step 1
    this.form1data = {hallname:"", details:"", booking_advance:null, price:null};

    //for step 2
    this.zoom = 12;
    this.latitude = 22.591784, 
    this.longitude = 88.403313;
    this.form2data = {full_address:"",lat:0,long:0,same_as_business:false,map_address:""} ;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //for step 3
    this.form3data = {ac:null,all_food_type:null,capacity:null,parking:null};

    //for step 4
    this.images = [];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBanquetPage');
    this.loadMap();
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
      if(this.form1data.hallname.trim() == "")
      {
        this.errormessage = "Enter a Hall name!";
        return false;
      }
      else if(this.form1data.details.trim() == "")
      {
        this.errormessage = "Enter details about your hall";
        return false;
      }
      else if(this.form1data.price<=0 || this.form1data.price==null)
      {
        this.errormessage = "Enter a valid price";
        return false;
      }
      else if(this.form1data.booking_advance<=0 || this.form1data.booking_advance==null)
      {
        this.errormessage = "Enter a valid advance booking amount";
        return false;
      }
      this.errormessage = "";
      return true;
    }
    else if(stepNo == 2) 
    {
      if(this.form2data.same_as_business)
      {
        this.errormessage = "";
        return true;
      }
      else
      {
        if(this.form2data.full_address.trim() == "")
        {
          this.errormessage = "Enter full address to display on your product";
          return false;
        }
        else if(this.form2data.map_address.trim() == "")
        {
          this.errormessage = "Enter a location to pick from map";
          return false;
        }
        else
        {
          this.errormessage = "";
          return true;
        }
      }
    }
    else if(stepNo == 3) 
    {
      if(this.form3data.capacity<=0 || this.form3data.capacity == null)
      {
        this.errormessage = "Enter hall capacity";
        return false;
      }
      else if(this.form3data.all_food_type == null)
      {
        this.errormessage = "Enter permitted food type";
        return false;
      }
      else if(this.form3data.ac == null)
      {
        this.errormessage = "Choose if AC is available";
        return false;
      }
      else if(this.form3data.parking == null)
      {
        this.errormessage = "Enter if parking is available";
        return false;
      }
      return true;
    }
    else if(stepNo == 4) 
    {
      /*
      if(this.images.length == 0)
      {
        this.errormessage = "Enter images of your hall";
        return false;
      }
      else
      */
        return true;
    }
    else
    {
      return false;
    }
  }


  //function for step 2
  setCurrentPosition() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.zoom = 16;
        });
    }
  }

  //function for step 3
  loadMap()
  {
    this.mapsAPILoader.load().then(() => {
      let nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
      let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
          types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();

              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                  return;
              }

              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 16;
          });
      });
  });
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
    let uploadData: {hall_name:string, details:string, price:number, booking_advance:number, address_same_as_business:boolean, full_address:string, lat:number, long:number, hall_capacity:number, veg_only:boolean, ac_available:boolean, parking_available:boolean, images:string[]};
    uploadData = {hall_name:"", details:"", price:null, booking_advance:null, address_same_as_business:null, full_address:"", lat:null, long:null, hall_capacity:null, veg_only:null, ac_available:null, parking_available:null, images:[]};
  
    uploadData.hall_name = this.form1data.hallname;
    uploadData.details = this.form1data.details;
    uploadData.price = this.form1data.price;
    uploadData.booking_advance = this.form1data.booking_advance;
    uploadData.address_same_as_business = this.form2data.same_as_business;
    if(!uploadData.address_same_as_business)
    {
      uploadData.full_address = this.form2data.full_address;
      uploadData.lat = this.latitude;
      uploadData.long = this.longitude;
    }
    uploadData.hall_capacity = this.form3data.capacity;
    uploadData.veg_only = !this.form3data.all_food_type;
    uploadData.ac_available = this.form3data.ac;
    uploadData.parking_available = this.form3data.parking;
    uploadData.images = this.images;
    //call and upload the uploadData object here
    console.log(uploadData);
  }
}
