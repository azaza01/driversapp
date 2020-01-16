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
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private endpoint = environment.endpoint;
  private url = this.endpoint;
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

  getDelivery(info: any, today) {
    let params = {
      email: info.email_address,
      password: info.password,
      driverid: info.id,
      date: today,
      // "email": "it01.azaza@gmail.com",
      // "password": "7c222fb2927d828af22f592134e8932480637c0d",
      // "driverid": "109",
      // "date": "2019-11-21"
    }



    return new Promise(resolve => {
      this.httpclient.post(this.url + "/gzipdelivery.json", params).subscribe(
        response => {
          let res;
          res = response;
          ////console.log(res)

          // this.storage.set('COLDEL_TABLE', res).then(() => {
            resolve(res)
          // });

        },
        err => {
          ////console.log(err)
          resolve(false)

          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      ////console.log(err)
    })
  }


  gettems(info) {
    let params = {
      "email": "davidchia@cottoncare.com.sg",
      "password": "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
      "driverid": "16",
      "coldelID": "124093"
    }

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/invitem.json", info).subscribe(
        response => {
          let res;
          res = response;
          ////console.log(res)
          info = res

          // this.storage.set('COLDEL_TABLE', res).then(() => {
            resolve(res)
          // });

        },
        err => {
          ////console.log(err)
          resolve(false)

          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      ////console.log(err)
    })
  }

  postponeDelivery(info, deliveryDate, deliverytime, selectedDelivery, reasonofpostpone, invoiceNo, invoiceId, todaysdate, currentisntruction) {

    let params = {
      "email" : info.email_address,
      "password": info.password,
      "name": info.name,
      // "email": "davidchia@cottoncare.com.sg",
      // "password": "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
      // "name": "DummyDriver",
      "id":  selectedDelivery,
      "date": deliveryDate,
      "time": deliverytime,
      "reasontopostpone": info.name + " " + todaysdate + " " + reasonofpostpone  + "\n \n" + currentisntruction, 
      "invoiceno" : invoiceNo,
      "invoiceid" : invoiceId
    }

    ////console.log(params)


    return new Promise(resolve => {
      this.httpclient.post(this.url + "/changedeliverydate.json", params).subscribe(
        response => {
          let res;
          res = response;
          ////console.log(res)
          info = res

          // this.storage.set('COLDEL_TABLE', res).then(() => {
            resolve(res)
          // });

        },
        err => {
          ////console.log(err)
          resolve(false)

          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      ////console.log(err)
    })
  }


}
