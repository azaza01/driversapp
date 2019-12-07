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
import { AccountsService } from './accounts.service';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class SyncinvoiceService {

  private endpoint = environment.endpoint;
  private url = this.endpoint;
  loading: any = new LoadingController;

  constructor(
    private httpclient: HttpClient,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private accSrvc: AccountsService,
    private network: Network

  ) { }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'email': 'davidchia@cottoncare.com.sg',
        'password': '585ae7c2bcd0b7409c9be2edc4b117e22a51b33d'
        // 'Authorization': 'Bearer ' + token
      })
    };
  }


  syncInvoice(info: any) {
    let infox = {
      "agreeddeliverydate": "2019-12-04",
      "bags": "1",
      "balancepaid": "0.00",
      "collectionid": "141699",
      "customerid": "27915",
      "deliverytimeslot": "I Day Time",
      "depositamount": "42",
      "deposittype": "CASH",
      "discount": "3.0500000000000003",
      "donatetotal": "10",
      "email": "davidchia@cottoncare.com.sg",
      "express": "0.5",
      "hasdonate": "10",
      "initial": "CC",
      "invoiceno": "CC-19129Ch0",
      "invoicenote": "['yuyuy']",
      "name": "Chia",
      "password": "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
      "savedon": "Sat Dec 07 2019 15:43:33 GMT+0800 (Philippine Standard Time)",
      "type": "New",
      "invoiceitem": info.invoiceitem
    }
    console.log(infox)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Content-Encoding': 'gzip',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization',
        // 'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT'
      })
    };

    return new Promise(resolve => {
      this.getHeaders()
      this.httpclient.post(this.url + "/addinvoice.json", infox).subscribe(
        response => {
          let res;
          res = response;
          console.log(res)

          this.storage.set('SYNCED_INVOICE_TABLE', res).then(() => {
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
