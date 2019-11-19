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
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private url = "https://ccmanager.cottoncare.com.sg/ws";
  loading: any = new LoadingController;

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

  getDelivery(info: any) {
    let params = {
      // email: info.email_address,
      // password: info.password,
      // driverid: info.id,
      // date: "2019-11-19",
      "email": "davidchia@cottoncare.com.sg",
      "password": "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
      "driverid": "16",
      "date": "2019-11-19"
    }



    return new Promise(resolve => {
      this.httpclient.post(this.url + "/gzipdelivery.json", params).subscribe(
        response => {
          let res;
          res = response;
          // console.log(res)

          this.storage.set('COLDEL_TABLE', res).then(() => {
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
