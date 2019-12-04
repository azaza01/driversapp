import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { LoadingController, IonFooter } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private endpoint = environment.endpoint;
  private url = this.endpoint;

  loading: any = new LoadingController;
  driverData: any;

  constructor(
    private httpclient: HttpClient,
    public loadingCtrl: LoadingController,
    private storage: Storage,

  ) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + token
      })
    };
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  login(info: any) {
    console.log(info)
    console.log(info.password)

    //convert password to sha1 
    // var sha1 = require('sha1');
    // var generatedpassword  = sha1(info.password);
    // info.password = generatedpassword;
    // console.log(info.password);

    let infox = {
      // email: "it01.azaza@gmail.com",
      // password: "7c222fb2927d828af22f592134e8932480637c0d"
      "email": "davidchia@cottoncare.com.sg",
      "password": "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
    }

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/logon.json", infox).subscribe(
        response => {
          let res;
          res = response[0];
          // console.log(res)
          this.driverData = res
          this.storage.set('ACCOUNTS_TABLE', res).then(() => {
            this.getStandingOrder(res)
            resolve(res)
          });

        },
        err => {
          console.log(err)
          resolve(false)

          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      console.log(err)
    })
  }

  getStandingOrder(info) {
    let params = {
      userid: info.id,
      email: info.email_address,
      password: info.password
    }
    return new Promise(resolve => {
      this.httpclient.post(this.url + "/standingorder.json", params).subscribe(
        response => {
          let res;
          res = response[0];
          console.log(res)
          this.storage.set('SO_TABLE', res[0]).then(() => {
            resolve(res)
          });
        },
        err => {
          console.log(err)
          resolve(false)

          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      console.log(err)
    })
  }

}
