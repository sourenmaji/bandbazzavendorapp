import { MapsAPILoader } from '@agm/core';
import { Component, NgZone, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ActionSheetController, IonicPage, NavController, NavParams, Platform, Slides, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

declare var google;
@IonicPage()
@Component({
  selector: 'page-add-banquet',
  templateUrl: 'add-banquet.html',
})

export class AddBanquetPage{

  @ViewChild('formslides') formSlide: Slides;
  @ViewChild('sliderbubbles') sliderbubbles: Slides;

  public len: number;
  public pageNo: number;
  public slides: any[] = [];
  public errormessage: string;
  public responseData: any;
  public token: string;

  //form 1 data
  public form1data: {hallname:string, details:string, price:number, advance_percent: number, tags:string};

  //form 2 data
  public latitude: number;
  public longitude: number;
  public latmap:number;
  public lngmap: number;
  // public searchControl: FormControl;
  public zoom: number;
  public business_id: number;

  // @ViewChild("search")
  // public searchElementRef;
  public form2data:{full_address, lat, long, same_as_business:boolean, map_address:string};

  //form 3 data
  public form3data: {capacity:number, ac_charge:number, ac_time: number, all_food_type:boolean, ac:boolean, parking:boolean, food_not_allowed: boolean, min_no_of_plates: number};
  
  //form 4 data
  // public images: any[];
  public imagesleft: string[];
  public imagesright: string[];

  public temp;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public imagePicker: ImagePicker,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public camera: Camera,
              public restServ: AuthServiceProvider,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public platform: Platform
            ) {
    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.token;
    this.business_id=this.navParams.data;
    console.log(this.business_id);

    //for card slide design
    this.pageNo = 0;
    this.len = 1;

    //for step 1
    this.form1data = {hallname:"", details:"", advance_percent:null, price:null,tags:""};

    //for step 2
    this.zoom = 12;
    this.latitude = 22.591784,
    this.longitude = 88.403313;
    this.form2data = {full_address:"",lat:0,long:0,same_as_business:false,map_address:""} ;

    //create search FormControl
    // this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //for step 3
    this.form3data = {ac:null,all_food_type:null,capacity:null,parking:null, ac_charge:null,ac_time: 1, food_not_allowed: null, min_no_of_plates: null};

    //for step 4
    // this.images = [];
    this.imagesleft = [];
    this.imagesright = [];
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)

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
      if(this.form1data.hallname.trim() == "")
      {
        this.errormessage = "Enter a banquet hall name!";
        return false;
      }
      else if(+this.form1data.price<0)
      {
        this.errormessage = "Enter a valid price";
        return false;
      }
      else if(+this.form1data.advance_percent>100)
      {
        console.log(+this.form1data.advance_percent>99);
        this.errormessage = "Enter a valid advance booking percent";
        return false;
      }
      // else if((+this.form1data.advance_percent) > (+this.form1data.price))
      // {
      //   this.errormessage = "Booking advance amount cannot be greater than booking price";
      //   return false;
      // }
      else if(this.form1data.details.trim() == "")
      {
        this.errormessage = "Enter details about your hall";
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
        if(this.form2data.map_address.trim() == "")
        {
          this.errormessage = "Enter a location to pick from map";
          return false;
        }
        else if(this.form2data.full_address.trim() == "")
        {
          this.errormessage = "Enter full address to display on your product";
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
        this.errormessage = "Choose permitted food type";
        return false;
      }
      else if(this.form3data.ac == null)
      {
        this.errormessage = "Choose if ac is available";
        return false;
      }
      else if(this.form3data.ac == true && this.form3data.ac_charge==null)
      {
        this.errormessage = "Enter a ac charge";
        return false;
      }
      else if(this.form3data.parking == null)
      {
        this.errormessage = "Choose if parking is available";
        return false;
      }
      else if(this.form3data.food_not_allowed == null)
      {
        this.errormessage = "Choose if outside food allowed";
        return false;
      }
      else if(this.form3data.food_not_allowed == true && this.form3data.min_no_of_plates==null)
      {
        this.errormessage = "Enter minimum no of plates";
        return false;
      }
      return true;
    }
    else if(stepNo == 4)
    {
      if((+this.imagesleft.length)+(+this.imagesright.length)>=1)
      {
        return true;
      }
      
      else
      {
        this.errormessage = "Please select a hall image";
        return false;
      }
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
          types: ["geocode"],componentRestrictions: {country: 'in'}
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
              this.form2data.full_address = place.formatted_address;
              this.form2data.map_address = place.formatted_address;
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

      if(this.imagesright.length< this.imagesleft.length)
        this.imagesright.push(imageData);
      else
        this.imagesleft.push(imageData);
     }, (err) => {
      // Handle error
      const toast = this.toastCtrl.create({
        message: err,
        duration: 5000,
        position: 'bottom'
      })
      toast.present();
     });
  }

  pickImage()
  {
    let remaining = 5 - this.imagesleft.length - this.imagesright.length;
    if(remaining <= 0)
    {
      return;
    }
    this.imagePicker.getPictures({maximumImagesCount:remaining, quality:60, outputType:1}).then
    (results =>{
      // alert(results);
      for(let i=0; i < results.length;i++){
        if(this.imagesright.length< this.imagesleft.length)
          this.imagesright.push(results[i]);
        else
          this.imagesleft.push(results[i]);
      };
    }, (err) => {
      // Handle error
      const toast = this.toastCtrl.create({
        message: err,
        duration: 5000,
        position: 'bottom'
      })
      toast.present();
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



  uploadData()
  {
    let uploadData: 
    {business_id: number,hall_name:string, ac_charge:number, ac_time: number, search_tags:string, details:string, price:number, advance_percent:number, address:string, location: string, lat:number, lng:number, capacity:number, is_veg:boolean, is_ac:boolean, is_parking:boolean, food_not_allowed:number, min_no_of_plates: number,images:string[]};

    uploadData = {business_id: null,search_tags:"", ac_charge:0, ac_time: null, hall_name:"", details:"", price:null, advance_percent:null, address:"", location: "", lat:null, lng:null, capacity:null, is_veg:null, is_ac:null, food_not_allowed:0, min_no_of_plates: 0,is_parking:null, images:[]};
    uploadData.business_id = this.business_id;
    uploadData.hall_name = this.form1data.hallname;
    uploadData.details = this.form1data.details;
    uploadData.price = this.form1data.price;
    uploadData.search_tags = this.form1data.tags;
    uploadData. advance_percent = this.form1data.advance_percent;

    uploadData.location=this.form2data.map_address;
    uploadData.address = this.form2data.full_address;
    uploadData.lat = this.latitude;
    uploadData.lng = this.longitude;
    uploadData.capacity = this.form3data.capacity;
    uploadData.is_veg = !this.form3data.all_food_type;
    uploadData.is_ac = this.form3data.ac;
    
    if(this.form3data.ac)
    {
    uploadData.ac_charge = this.form3data.ac_charge;
    uploadData.ac_time = this.form3data.ac_time;
    }

    uploadData.is_parking = this.form3data.parking;
    uploadData.food_not_allowed = this.form3data.food_not_allowed ? 1 : 0;
    uploadData.min_no_of_plates = this.form3data.min_no_of_plates;

    // uploadData.images = this.images;
    uploadData.images = [];
    this.imagesright.forEach(element => {
      uploadData.images.push(element);
    });
    this.imagesleft.forEach(element => {
      uploadData.images.push(element);
    });

    //call and upload the uploadData object here
    this.restServ.authData(uploadData,'add_product_hall',this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);
      if(this.responseData.status==true)
      {
        let toast = this.toastCtrl.create({
          message: this.responseData.message,
          duration: 5000,
          position: 'bottom'
        });
        toast.present();

        this.restServ.pageReset=true;
        this.navCtrl.pop();
      }
      else
      {
        let toast = this.toastCtrl.create({
          message: this.responseData.message,
          duration: 5000,
          position: 'bottom'
        });
        toast.present();
      }

    }, (err) => {
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
