import { LoadingController , Loading} from 'ionic-angular';
import { FileTransferObject ,FileTransfer, FileUploadResult} from '@ionic-native/file-transfer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';


let apiUrl = 'http://192.168.0.130/BandBazza/public/api/';
//let apiUrl = 'http://www.bandbazza.com/api/';
// let apiUrl = 'http://localhost:8000/api/';

@Injectable()
export class AuthServiceProvider {
  pageReset: boolean = false;
  loading: Loading;
  constructor(public http: Http, public httpC: HttpClient, private transfer: FileTransfer, public loadingCtrl: LoadingController) {
    console.log('Hello AuthServiceProvider Provider');
  }

  responseData : FileUploadResult = null;
  getDataWithoutToken(type) {
   // console.log(credentials)
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      console.log(headers);
      console.log(apiUrl+type);

      this.http.get(apiUrl+type, {headers: headers})
        .subscribe(res => {
          console.log(res.json());
          resolve(res.json());
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
      let headers = new Headers();
      console.log(headers);
      console.log(apiUrl+type);

      this.http.post(apiUrl+type, credentials, {headers: headers})
        .subscribe(res => {
          console.log(res.json());
          resolve(res.json());
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
      let headers = new Headers();
      console.log(token);
      headers.append('Accept','application/json');
      headers.append('Authorization','Bearer '+ token);
      console.log(headers);

      this.http.post(apiUrl+type, credentials, {headers: headers})
        .subscribe(res => {
          this.loading.dismissAll();
          console.log(res.json());
          resolve(res.json());
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
      let headers = new Headers();
      console.log(token);
      headers.append('Accept','application/json');
      headers.append('Authorization','Bearer '+ token);
      console.log(headers);
      console.log(apiUrl+type);

      this.http.get(apiUrl+type,{headers: headers})
        .subscribe(res => {
          console.log(res.json());
          resolve(res.json());
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
      // console.log(headers);
      // console.log(token);
      // console.log(params);

      console.log(apiUrl+type);

      this.httpC.get(apiUrl+type,{params,headers})
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

  testCall()
  {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      //console.log(token);
      headers.append('Accept','application/json');
      //headers.append('Authorization','Bearer '+ token);
      console.log(headers);
      //console.log(apiUrl+type);

      this.http.get(apiUrl+"test",{headers: headers})
        .subscribe(res => {
          console.log(res.json());
          resolve(res.json());
        },
        (err) => {
          console.log(err.json());
          reject(err);
        });
    });
  }

  //added by krishnabose02


}
