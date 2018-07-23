import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SlideEffect } from 'ionic-angular/umd/components/slides/swiper/swiper-interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the AddCatererPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-caterer',
  templateUrl: 'add-caterer.html',
})
export class AddCatererPage {
  @ViewChild('formslides') formSlide: Slides;
  @ViewChild('sliderbubbles') sliderbubbles: Slides;
  public slides: any[] = [];
  public data:any;
  public text: string;
  public pageNo: number;
  public len: number;
  public packagetype: any;
  public step1data:{packagename:string, veg: boolean};
  public formstep1 : FormGroup;

  //validators for step 1
  public emptypkgname: string = "";




  constructor(public navCtrl: NavController, public navParams: NavParams, public restServ: AuthServiceProvider) {
    this.pageNo = 0;
    this.len = 1;
    this.step1data = {packagename:"", veg:false};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCatererPage');
    //console.log(this.formSlide.length);
  }

  ngOnInit()
  {
    this.formstep1 = new FormGroup({
      pkgnm: new FormControl("", [Validators.required, Validators.minLength(3)])
    }
    );
  }

  ionViewDidEnter()
  {
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
  setVeg(isVeg:boolean)
  {
    this.step1data.veg = isVeg;
  }


  validateStep(stepNo: number)
  {
    if(stepNo == 1) //this is step 1, check if user has entered a package name
    {
      if(this.step1data.packagename == "")
      {
        this.emptypkgname = "enter a package name!";
        return false;
      }
        else if (this.step1data.packagename.length < 4)
        {
          this.emptypkgname = "Package name is short!"
          return false;
        }
        else
        {
          this.emptypkgname = "";
          return true;
        }
          
      return true;
    }

    return false;
  }


  trigger(property: string, step: number)
  {
    if(step == 1)
    {
      // add trigger stuff generated from step 1
      if(property == 'packagename')
      {
        this.step1data.packagename = this.step1data.packagename.trim();
        this.validateStep(step);
      }
    }
  }
}
