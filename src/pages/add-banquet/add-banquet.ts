import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ActionSheetController, AlertController } from 'ionic-angular';
import { ImagePicker } from '../../../node_modules/@ionic-native/image-picker';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';
import { FormControl } from '../../../node_modules/@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

declare var google;
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
  public responseData: any;
  public token: string;

  //form 1 data
  public form1data: {hallname:string, details:string, price:number, booking_advance: number, tags:string};

  //form 2 data
  public latitude: number;
  public longitude: number;
  public latmap:number;
  public lngmap: number;
  public searchControl: FormControl;
  public zoom: number;
  public business_id: number;

  @ViewChild("search")
  public searchElementRef;
  public form2data:{full_address, lat, long, same_as_business:boolean, map_address:string};

  //form 3 data
  public form3data: {capacity:number, ac_charge:number, all_food_type:boolean, ac:boolean, parking:boolean};
  //form 4 data
  public images: string[];

  public temp;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public imagePicker: ImagePicker,
              public actionSheetCtrl: ActionSheetController,
              public camera: Camera,
              public restServ: AuthServiceProvider,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private alertCtrl: AlertController
            ) {
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.success.token;
    this.business_id=this.navParams.data;
    console.log(this.business_id);

    //for card slide design
    this.pageNo = 0;
    this.len = 1;

    //for step 1
    this.form1data = {hallname:"", details:"", booking_advance:null, price:null,tags:""};

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
    this.form3data = {ac:null,all_food_type:null,capacity:null,parking:null, ac_charge:null};

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
      else if(this.form1data.tags.trim() == "")
      {
        this.errormessage = "Enter some search tags for your hall";
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
      else if(this.form3data.ac == true && this.form3data.ac_charge==null)
      {
        this.errormessage = "Enter a AC charge";
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
            this.latmap = this.latitude;
            this.lngmap = this.longitude;
            this.zoom = 16;
        });
    }
  }

  mapClicked(event: any) {
    console.log(event);
    
    this.latitude=event.coords.lat;
    this.longitude=event.coords.lng;
    
  }

  //function for step 3
  loadMap()
  {
    this.mapsAPILoader.load().then(() => {
      let nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
      let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
          types: ["geocode"]
      });
      autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
              //get the place result
              let place: any = autocomplete.getPlace();

              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                  return;
              }

              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.latmap = this.latitude;
              this.lngmap = this.longitude;
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
      quality: 60,
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
    this.imagePicker.getPictures({maximumImagesCount:remaining, quality:60, outputType:1}).then
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
    let uploadData: {business_id: number,hall_name:string, ac_charge:number, search_tags:string, details:string, price:number, book_advance:number, address_same_as_business:boolean, address:string, location: string, lat:number, lng:number, capacity:number, is_veg:boolean, is_ac:boolean, is_parking:boolean, images:string[]};
    uploadData = {business_id: null,search_tags:"", ac_charge:0, hall_name:"", details:"", price:null, book_advance:null, address_same_as_business:null, address:"", location: "", lat:null, lng:null, capacity:null, is_veg:null, is_ac:null, is_parking:null, images:[]};
    uploadData.business_id = this.business_id;
    uploadData.hall_name = this.form1data.hallname;
    uploadData.details = this.form1data.details;
    uploadData.price = this.form1data.price;
    uploadData.search_tags = this.form1data.tags;
    uploadData.book_advance = this.form1data.booking_advance;
    // uploadData.address_same_as_business = this.form2data.same_as_business;
    uploadData.ac_charge = this.form3data.ac_charge;
    // if(!uploadData.address_same_as_business)
    // {
    //   uploadData.address = this.form2data.full_address;
    //   uploadData.lat = this.latitude;
    //   uploadData.lng = this.longitude;
    // }
    uploadData.location=this.form2data.map_address;
    uploadData.address = this.form2data.full_address;
    uploadData.lat = this.latitude;
    uploadData.lng = this.longitude;
    uploadData.capacity = this.form3data.capacity;
    uploadData.is_veg = !this.form3data.all_food_type;
    uploadData.is_ac = this.form3data.ac;
    uploadData.is_parking = this.form3data.parking;
    uploadData.images = this.images;
    //call and upload the uploadData object here
    console.log(uploadData);
    alert(uploadData);
    //call the rest here..
    this.restServ.authData(uploadData,'add_product_hall',this.token).then((data) => {
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
