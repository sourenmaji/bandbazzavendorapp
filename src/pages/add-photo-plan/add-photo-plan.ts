import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CustomValidator } from '../../validators/custom-validators';

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public restServ: AuthServiceProvider,
    private alertCtrl: AlertController
  ) {
    console.log(this.navParams.data)
    this.module=this.navParams.get('module');

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
    this.token = data.success.token;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPhotoPlanPage');
  }

  addPlan()
  {
    console.log(this.addPlanForm.value);
    this.restServ.authData(this.addPlanForm.value,'add_photography_plan',this.token).then((data) => {
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
     const alert = this.alertCtrl.create({
      subTitle: "Something went wrong! Please try again.",
      buttons: ['OK']
    })
    alert.present();
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
        const alert = this.alertCtrl.create({
        subTitle: "Something went wrong! Please try again.",
        buttons: ['OK']
      })
      alert.present();
      });
  }

}
