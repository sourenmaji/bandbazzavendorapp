import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ImagePicker } from '@ionic-native/image-picker';

/**
 * Generated class for the AddCarsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-cars',
  templateUrl: 'add-cars.html',
})
export class AddCarsPage {

  public token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjA1MWNkNzUyZjhjZWUzY2Q0MmQzNzAzY2ExOGZkZmU4NDc0NmJlMzBiNzI3ZmM2ZWNkZTYyN2ExNWNmMzI5ODRjYjA2NzY2YjI2ZTk2YzE0In0.eyJhdWQiOiIxIiwianRpIjoiMDUxY2Q3NTJmOGNlZTNjZDQyZDM3MDNjYTE4ZmRmZTg0NzQ2YmUzMGI3MjdmYzZlY2RlNjI3YTE1Y2YzMjk4NGNiMDY3NjZiMjZlOTZjMTQiLCJpYXQiOjE1MzE5ODY1OTEsIm5iZiI6MTUzMTk4NjU5MSwiZXhwIjoxNTYzNTIyNTkxLCJzdWIiOiIzIiwic2NvcGVzIjpbXX0.AqYVcs-YCspA2pyteHvB9jsh18aX8qaJzmlq9oUuXb0PJ_zUwj272itEKscJ4LhMlApt9GhrCtdTEK-90MVMbDVXp1z7kj_Mg9wzULyXVpdj9xQUwkRZsLcINLqpHgrsleZcUuNcuwKiibVLMjRcJ5Jz_eOnbr4E62UxQVUkOjVzEciAjucdI73FepK5HjOaEmW4qjxuxtbO8zeVotQn42yWDsTtRqL8-GNBn4MT2lQuMMS9m89SioVD4WHbSeAURMd1gQbiju1xSqmzUc7rDnNUniIhVQYkmmm39zbCJ2hQlfvTC1CCWz6i-h18AXbKvdSqauRlBIodHklV3mvgqyhkKHFn7EOCf8FUEpTJrwMJVGKuEa8iuCMJnYe7dBvAdqXp-CjgcoD2jiCU6GhilmzTmP2Ec2g-K18Wu4t2aPZlTOoFUpQd6P_P3m7kFn7Dv8Z_UKrJk-mLZA1KV5EfX-QYn95pM0sB3Pqjg-6xllFa8qk9ZdSeDRY8ZN7-23ye1J5-v2GQ3b0m5Mm8cqN0WGzVyma5PkIah7ioBgFN9co6QOdDh_SfHdN_Y74bQdzp2LI97h02O0YQQRYu7z_eBD1FEgzxMzj2CSOs3Z9zl3noLjd1T8mF6A-3qx89dPBZ84WE5SpTaLrSXh7V4hVeLyXZbuBnZ3C7g2ogvt0-W3I";
  @ViewChild('formslides') formSlide: Slides;
  @ViewChild('sliderbubbles') sliderbubbles: Slides;
  public len: number;
  public pageNo: number;
  public slides: any[] = [];
  public errormessage: string;

  //form 1 data
  public form1data:{brand:string, model: string, type: number};
  public carbrands: {car_company_name:string, id: number}[];
  public carmodels: {car_model:string, model_id:number}[];
  public cartypes:  {type:string, id:number}[];
  public unknowncar: boolean;
  public responseData: any;

  //form 2 data
  public ac_available: boolean = false;

  //form 3 data
  public images: string[];






  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public restServ: AuthServiceProvider,
              public imagePicker: ImagePicker
  ) {
    //for card slide design
    this.pageNo = 0;
    this.len = 1;


    //for form 1
    this.carbrands = [{car_company_name:"All Brands",id:0}];
    this.carmodels = [{car_model:"All models", model_id:0}];
    this.form1data = {model:null, type: null, brand:null};
    this.cartypes =  [{type:"All", id:0}];
    this.initCarData();

    //for form 2

    //for form 3
    //for dummies
    this.images = [];
    this.images.push("https://auto.ndtvimg.com/car-images/medium/maruti-suzuki/alto-800/maruti-suzuki-alto-800.jpg?v=2");
    this.images.push("https://auto.ndtvimg.com/car-images/big/lamborghini/urus/lamborghini-urus.jpg?v=6");
    this.images.push("https://auto.ndtvimg.com/car-images/medium/maruti-suzuki/baleno/maruti-suzuki-baleno.jpg?v=2");
    console.log(this.images);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCarsPage');
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
    //TODO: validation suppresed due to rapid development, uncomment these
    /*
    if(!this.validateStep(this.pageNo+1)) // step number is one more than pageNo, thanks to array base zero
    {
      console.log("unknown error "+ this.pageNo);
      return;
    }
    */
    //console.log(this.form1data);
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
    if(stepNo == 1) //this is step 1, check if user has entered a package name
    {
      console.log("inside form validator for step No "+stepNo);
      if(this.form1data.brand==null)
      {
        this.errormessage = "Please select/enter a brand"
        return false;
      }
      else if(this.form1data.model==null)
      {
        this.errormessage = "Please select/enter a model"
        return false;
      }
      else if(this.form1data.type==null)
      {
        this.errormessage = "Please select a car type"
        return false;
      }
      this.errormessage = "";
      return true;
    }
    return true;
  }

  //functions for form 1
  initCarData()
  {
    //call rest endpoint and populate the initial data required here
    //TODO: token to load from local storage
    this.restServ.getData("get_car_details", this.token).then((result) => {
      this.responseData = result;
      this.carbrands = [];
      this.responseData.brands.forEach(element => {
        console.log(element.car_company_name);
        this.carbrands.push(element);
      });

      this.cartypes = [];
      this.responseData.types.forEach(element => {
        this.cartypes.push({type:element.type, id: element.id});
      });

      this.cartypes.forEach(element => {
        console.log(element);
      });
    },
    (err) => {
      this.responseData = err.json();
      console.log(this.responseData);
     });

  }

  updateModels(brand: {car_company_name:string, id: number})
  {
    //TODO: change the token to load from local storage
    console.log(brand);
    this.form1data.brand = brand.car_company_name;
    this.form1data.model = null;
    this.errormessage = "";
    this.restServ.getData("get_car_models?id="+brand.id, this.token).then((result)=>
    {

      this.carmodels = [];
      this.responseData = result;
      this.responseData.models.forEach(element => {
        this.carmodels.push({car_model:element.car_model, model_id: element.model_id});
      });
    },
    (err)=>{
      this.responseData = err.json();
      console.log(this.responseData);
      this.carmodels = [];
    }   

  ); 
  }

  storeModel(model: {car_model:string, model_id:number})
  {
    this.form1data.model = model.car_model;
    this.errormessage = "";
  }

  storeType(type: {type:string, id:number})
  {
    this.form1data.type = type.id;
  }
  switchInputMethod()
  {
    this.form1data.brand = null;
    this.form1data.model = null;
  }

  //functions for form 2

  //function for form 3
  pickImage()
  {
    this.imagePicker.getPictures({maximumImagesCount:2, quality:10}).then
    (results =>{
      console.log(results);
      for(let i=0; i < results.length;i++){
        this.images.push(results[i]);
      };
    });
  }

  removeImage(src: string)
  {
    let newimage: string[] = [];
    this.images.forEach(element => {
      if(element != src)
        newimage.push(element);
    });
    this.images = newimage;
  }
}
/*
import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormControl} from "@angular/forms";
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;

    @ViewChild("search")
    public searchElementRef;

  constructor(public navCtrl: NavController, private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone)  {
      this.zoom = 4;
      this.latitude = 39.8282;
      this.longitude = -98.5795;

      //create search FormControl
      this.searchControl = new FormControl();

      //set current position
      this.setCurrentPosition();

  }

  ionViewDidLoad() {
      //set google maps defaults
      this.zoom = 4;
      this.latitude = 39.8282;
      this.longitude = -98.5795;

      //create search FormControl
      this.searchControl = new FormControl();

      //set current position
      this.setCurrentPosition();

      //load Places Autocomplete
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
                  this.zoom = 12;
              });
          });
      });
  }

    private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
            });
        }
    }

}

*/