import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  userPostData = {"user":"","token":""};
  userPassword = {"password":"","password_confirmation":""};
  userDetails : any;
  responseData: any;
  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {

    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.success.user;

    this.userPostData.user = this.userDetails;
    this.userPostData.token = data.success.token;
    console.log(this.userPostData.token);
  }

  editform: FormGroup;
  userData = { "name": "","email": "","phone": "","address": ""};


  ngOnInit() {
    let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let PHONEPATTERN = /^[0-9]{10}$/;
    this.editform = new FormGroup({
      // username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(PHONEPATTERN)])),
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      address: new FormControl('', Validators.compose([]))
    });

    
  }

  onOpenMenu(){
    this.menuCtrl.open();
  }
}
