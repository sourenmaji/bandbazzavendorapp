import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform, Slides, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-add-cars',
  templateUrl: 'add-cars.html',
})
export class AddCarsPage {


  public token: string = "";
  @ViewChild('formslides') formSlide: Slides;
  @ViewChild('sliderbubbles') sliderbubbles: Slides;
  public len: number;
  public pageNo: number;
  public slides: any[] = [];
  public errormessage: string;
  public business_id: number;

  //form 1 data
  public form1data:{brand:string, model: string, type: number};
  public carbrands: {car_company_name:string, id: number}[];
  public carmodels: {car_model:string, model_id:number}[];
  public cartypes:  {type:string, id:number}[];
  public unknowncar: boolean;
  public responseData: any;
  public brand_name:string = null;
  public model_name:string = null;
  public car_type:string = null;

  //form 2 data
  public ac_available: boolean = false;
  public form2data: {no_of_seats:number, min_hire_period: number, min_hire_distance: number, car_price_hour: number, car_price_kil: number, ac_car_price_hour: number, ac_car_price_kil: number, book_advance: number, car_tags: string};

  //form 3 data
  public imagesleft: string[];
  public imagesright: string[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restServ: AuthServiceProvider,
              public imagePicker: ImagePicker,
              public actionSheetCtrl: ActionSheetController,
              public camera: Camera,
              private alertCtrl: AlertController,
              public platform: Platform,
              public toastCtrl: ToastController

  ) {
    //for card slide design
    this.pageNo = 0;
    this.len = 1;
    this.business_id=this.navParams.data;
    console.log(this.business_id);

    this.responseData = {}
    const data = JSON.parse(localStorage.getItem('userData'));
    this.token = data.token;


    //for form 1
    this.carbrands = [{car_company_name:"All Brands",id:0}];
    this.carmodels = [{car_model:"All models", model_id:0}];
    this.form1data = {model:null, type: null, brand:null};
    this.cartypes =  [{type:"All", id:0}];
    this.initCarData();

    //for form 2
    this.form2data ={no_of_seats: null, ac_car_price_hour:null, ac_car_price_kil:null, book_advance:null,car_price_hour:null,car_price_kil:null,car_tags:"",min_hire_period:null, min_hire_distance: null};

    //for form 3
    //for dummies
    this.imagesleft = [];
    this.imagesright = [];
    let backAction =  platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    },2)
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

    if(this.pageNo == 3)
    {
      this.uploadData();
    }
    if(!this.validateStep(this.pageNo+1)) // step number is one more than pageNo, thanks to array base zero
    {
      console.log("unknown error "+ this.pageNo);
      return;
    }

    //console.log(this.form1data);
    this.pageNo++;
    this.errormessage = "";
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

    if(stepNo == 2)
    {
      if(this.isInvalid(this.form2data.no_of_seats, "Enter valid no. of seats"))
      return false;

      if(this.isInvalid(this.form2data.min_hire_period, "Enter valid minimum hire period"))
      return false;

      if(this.isInvalid(this.form2data.min_hire_distance, "Enter valid minimum hire distance"))
      return false;

      // else if(this.isInvalid(this.form2data.car_price_hour, "Enter valid rate per hour (Non-AC)"))
      // return false;

      // else if(this.isInvalid(this.form2data.car_price_kil, "Enter valid rate per km (Non-AC)"))
      // return false;

      // else if(this.ac_available)
      // {
      //   if(this.isInvalid(this.form2data.ac_car_price_hour, "Enter valid rate per hour (AC)"))
      //   return false;

      //   if(this.isInvalid(this.form2data.ac_car_price_kil, "Enter valid rate per km (AC)"))
      //   return false;
      // }

      // else if(this.isInvalid(this.form2data.book_advance, "Enter a valid advance booking fee"))
      // return false;

      return true;

    }
    if(stepNo == 3)
    {
      if((+this.imagesleft.length)+(+this.imagesright.length)>=1)
      return true;
      else
      this.errormessage = "Please select a car image"
    }

    return false;
  }

  //functions for form 1
  initCarData()
  {
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
      this.responseData = err;
      console.log(this.responseData);
      const toast = this.toastCtrl.create({
        message: 'Oops! Something went wrong.',
        duration: 3000,
        position: 'top'
      })
      toast.present();
     });

  }

  updateModels(brand: {car_company_name:string, id: number})
  {
    console.log(brand);
    this.form1data.brand = brand.id+"";
    this.brand_name=brand.car_company_name;
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
      this.responseData = err;
      console.log(this.responseData);
      this.carmodels = [];
      const toast = this.toastCtrl.create({
        message: 'Oops! Something went wrong.',
        duration: 3000,
        position: 'top'
      })
      toast.present();
    }
  );
  }

  storeModel(model: {car_model:string, model_id:number})
  {
    this.form1data.model = model.model_id+"";
    this.model_name = model.car_model;
    this.errormessage = "";
  }

  storeType(type: {type:string, id:number})
  {
    this.form1data.type = type.id;
    this.car_type = type.type;
  }
  switchInputMethod()
  {
    this.form1data.brand = null;
    this.form1data.model = null;
  }

  //functions for form 2
  isInvalid(value: number, errorm: string):boolean
  {
    if(value<=0 || value == null)
    {
      this.errormessage = errorm;
      return true;
    }
    return false;
  }

  clearAcRates()
  {
    this.form2data.ac_car_price_hour = null;
    this.form2data.ac_car_price_kil = null;
  }
  //function for form 3

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
    const toast = this.toastCtrl.create({
      message: err,
      duration: 3000,
      position: 'top'
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
    this.imagePicker.getPictures({maximumImagesCount:remaining, quality: 60, outputType:1}).then
    (results =>{
      console.log(results);
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
        duration: 3000,
        position: 'top'
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
    //call rest service and upload the carData
    let carData: any = {};
    if(this.unknowncar)
    {
      carData.brand_id = this.form1data.brand;
      carData.model_id = this.form1data.model;
    }
    else{
      carData.brand_id = this.form1data.brand;
      carData.model_id = this.form1data.model;
    }
    carData.business_id = this.business_id;
    carData.car_tags = this.form2data.car_tags;
    carData.car_type = this.form1data.type;
    carData.car_price_hour = this.form2data.car_price_hour;
    carData.car_price_kil = this.form2data.car_price_kil;
    carData.min_hire_period = this.form2data.min_hire_period;
    carData.min_hire_distance = this.form2data.min_hire_distance;

    carData.no_of_seats = this.form2data.no_of_seats;
    if(this.ac_available)
    {
      carData.ac_car_price_hour = this.form2data.ac_car_price_hour;
      carData.ac_car_price_kil = this.form2data.ac_car_price_kil;
    }
    carData.book_advance = this.form2data.book_advance;
    carData.images = [];
    this.imagesright.forEach(element => {
      carData.images.push(element);
    });
    this.imagesleft.forEach(element => {
      carData.images.push(element);
    });

    console.log(carData);
    //call the rest here..
    this.restServ.authData(carData,'add_product_car',this.token).then((data) => {
      this.responseData = data;
      console.log(this.responseData);
      if(this.responseData.status==true)
      {
        this.restServ.pageReset=true;
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
     const toast = this.toastCtrl.create({
      message: 'Oops! Something went wrong.',
      duration: 3000,
      position: 'top'
    })
    toast.present();
    });
  }
}
