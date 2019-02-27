import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileUploadResult } from '@ionic-native/file-transfer';
import { Loading, LoadingController } from 'ionic-angular';

@Injectable()
export class AuthServiceProvider {
  pageReset: boolean = false;
  // imageUrl: string = 'http://192.168.1.106/bandbazza/public/';
  // apiUrl: string = 'http://192.168.1.106/bandbazza/public/api/v1/';

  // imageUrl: string = 'http://localhost:8000/';
  // apiUrl: string = 'http://localhost:8000/api/v1/';

  // imageUrl: string = 'http://dev.bandbazza.com/';
  // apiUrl: string = 'http://dev.bandbazza.com/api/v1/';

  imageUrl: string = 'https://www.bandbazza.com/';
  apiUrl: string = 'https://www.bandbazza.com/api/v1/';


  loading: Loading;

  constructor(public httpC: HttpClient, public loadingCtrl: LoadingController) {
    console.log('Hello AuthServiceProvider');
    console.log(this.imageUrl);
  }
  responseData : FileUploadResult = null;

  getDataWithoutToken(type) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      console.log(headers);
      console.log(this.apiUrl+type);

      this.httpC.get(this.apiUrl+type, {headers})
        .subscribe(res => {
          console.log(res);
          resolve(res);
        },
        (err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  postData(credentials, type) {
    console.log(credentials)
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      console.log(headers);
      console.log(this.apiUrl+type);

      this.httpC.post(this.apiUrl+type, credentials, {headers})
        .subscribe(res => {
          console.log(res);
          resolve(res);
        },
        (err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  authData(credentials, type, token) {
    console.log(credentials)
    return new Promise((resolve, reject) => {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      let headers = new HttpHeaders({
        'Accept': 'application/json',
        'Authorization':'Bearer '+ token
      });
      console.log(headers);

      this.httpC.post(this.apiUrl+type, credentials, {headers})
        .subscribe(res => {
          this.loading.dismissAll();
          console.log(res);
          resolve(res);
        },
        (err) => {
          this.loading.dismissAll();
          console.log(err);
          reject(err);
        });
    });
  }

  getData(type, token) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        'Accept': 'application/json',
        'Authorization':'Bearer '+ token
      });
      console.log(headers);
      console.log(this.apiUrl+type);

      this.httpC.get(this.apiUrl+type,{headers})
        .subscribe(res => {
          console.log(res);
          resolve(res);
        },
        (err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  getDataParams(type, params, token) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        'Accept': 'application/json',
        'Authorization':'Bearer '+ token
      });
      console.log(this.apiUrl+type);

      this.httpC.get(this.apiUrl+type,{params,headers})
        .subscribe(res => {
          console.log(res);
          resolve(res);
        },
        (err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}
