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

  getToday() {
    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let yy = (yyyy + '').substr(2, 2);

    today = yyyy + '-' + mm + '-' + dd;
    // console.log(today)
    return today
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Accept-Encoding, Authorization, application/x-www-form-urlencoded',
        'Access-Control-Allow-Methods': 'GET, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT'
        // 'Authorization': 'Bearer ' + token
      })
    };
  }

  async addinvoiceServiceLocal(info: any) {
    console.log(info)

    let infox = {
      "email": info.drvem,
      "password": info.drvpa,
      "initial": info.UNINV_INITIAL,
      "customerid": info.UNINV_CUSTID,
      "collectionid": info.UNINV_COLLID,
      "invoiceno": info.UNINV_INVNO,
      "type": info.UNINV_TYPE,
      "depositamount": info.UNINV_DEPOAMT,
      "deposittype": info.UNINV_DEPOTYPE,
      "balancepaid": info.UNINV_BALANCE,
      "name": info.drvna,
      "agreeddeliverydate": info.UNINV_AGREEDDELIVERYDATE,
      "deliverytimeslot": info.UNINV_DELIVERYTIMESLOT,
      "invoiceitem": info.colitem,
      "invoicenote": info.UNINV_INVOICENOTE,
      "hasdonate": info.UNINV_HASDONATE,
      "donatetotal": info.UNINV_DONATE,
      "discount": info.UNINV_DISCOUNT,
      "express": info.UNINV_EXPRESS,
      "bags": info.UNINV_BAGS,
      "savedon": info.UNINV_SAVEDON
    }
    console.log(info)

    await this.presentLoading('Syncing Collection');
    return new Promise(resolve => {
      this.httpclient.post(this.url + "/addinvoice.json", infox).subscribe(
        response => {
          let res;
          res = response;
          console.log(res)
          resolve(res)
          this.loading.dismiss();

          // this.storage.set('SYNCED_INVOICE_TABLE', res).then(() => {
          //   resolve(res)
          // });

        },
        err => {
          console.log(err)
          resolve(false)
          this.loading.dismiss();
          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      console.log(err)
    })
  }


  async addinvoiceService(info: any) {
    console.log(info)

    let infox = {
      "email": "it01.azaza@gmail.com",
      "password": "7c222fb2927d828af22f592134e8932480637c0d",
      "initial": "DC",
      "customerid": "24047",
      "collectionid": "142819",
      "invoiceno": "CC-191215Du02",
      "type": "39",
      "depositamount": "0.00",
      "deposittype": "Cash",
      "balancepaid": "0.00",
      "name": "DummyDriver",
      "agreeddeliverydate": "2019-12-23",
      "deliverytimeslot": "O Any Time",
      "invoiceitem": "[{\\\"cat_type\\\":\\\"Additional\\\",\\\"description\\\":\\\"Hangers\\\",\\\"clean_type\\\":\\\"-\\\",\\\"ready_type\\\":\\\"Pack\\\",\\\"price\\\":0.2,\\\"is_ready\\\":\\\"no\\\",\\\"qty\\\":200,\\\"pieces\\\":200}]",
      "invoicenote": "[{\\\"name\\\":\\\"\\\"}]",
      "hasdonate": "0",
      "donatetotal": "0",
      "discount": 0,
      "express": "1.00",
      "bags": "0",
      "savedon": "2019-12-16 11:48:11"
    }
    console.log(info)

    await this.presentLoading('Syncing Collection');
    return new Promise(resolve => {
      this.httpclient.post(this.url + "/addinvoice.json", info).subscribe(
        response => {
          let res;
          res = response;
          console.log(res)
          resolve(res)
          this.loading.dismiss();

          // this.storage.set('SYNCED_INVOICE_TABLE', res).then(() => {
          //   resolve(res)
          // });

        },
        err => {
          console.log(err)
          resolve(false)
          this.loading.dismiss();
          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      console.log(err)
    })
  }

  // getToday() {
  //   let today;
  //   let dd = new Date().getDate();
  //   let mm = new Date().getMonth() + 1;
  //   let yyyy = new Date().getFullYear();
  //   let hr = new Date().getHours();
  //   let min = new Date().getMinutes();
  //   let ss = new Date().getSeconds();
  //   let yy = (yyyy + '').substr(2, 2);

  //   today = yyyy + '-' + mm + '-' + dd + " " + hr + ":" + min + ":" + ss;
  //   this.todaydate = today
  //   console.log(this.todaydate)
  // }

  //   syncInvoice(info: any) {
  //     console.log(info)
  //   let infox = {
  //   "email": "it01.azaza@gmail.com",
  // 	"password": "7c222fb2927d828af22f592134e8932480637c0d",
  // 	"initial": "DC",
  // 	"customerid": "24047",
  // 	"collectionid": "142819",
  // 	"invoiceno": "CC-191215Du02",
  // 	"type": "39",
  // 	"depositamount": "0.00",
  // 	"deposittype": "Cash",
  // 	"balancepaid": "0.00",
  // 	"name": "DummyDriver",
  // 	"agreeddeliverydate": "2019-12-23",
  // 	"deliverytimeslot": "O Any Time",
  // 	"invoiceitem": "[{\\\"cat_type\\\":\\\"Additional\\\",\\\"description\\\":\\\"Hangers\\\",\\\"clean_type\\\":\\\"-\\\",\\\"ready_type\\\":\\\"Pack\\\",\\\"price\\\":0.2,\\\"is_ready\\\":\\\"no\\\",\\\"qty\\\":200,\\\"pieces\\\":200}]",
  // 	"invoicenote": "[{\\\"name\\\":\\\"\\\"}]",
  // 	"hasdonate": "0",
  // 	"donatetotal": "0",
  // 	"discount": 0,
  // 	"express": "1.00",
  // 	"bags": "0",
  // 	"savedon": "2019-12-16 11:48:11"
  // }

  //     //https://ccmanager.1kbiz.com/server_ionic/manage_data.php

  //     return new Promise(resolve => {
  //       this.httpclient.post(this.url + "/addinvoice.json", infox).subscribe(
  //         response => {
  //           let res;
  //           res = response;
  //           console.log(res)

  //           this.storage.set('SYNCED_INVOICE_TABLE', res).then(() => {
  //             resolve(res)
  //           });

  //         },
  //         err => {
  //           console.log(err)
  //           resolve(false)

  //           // alert(JSON.stringify(err));
  //         }
  //       );

  //     }).catch(err => {
  //       console.log(err)
  //     })
  //   }


  checkOverDue(info: any) {
    //address.setText(o.getCDListAddress() + "\n" + o.getCDListUnit() + " S" +o.getCDListPostal() + "\n" + o.getCDListBuilding() +  "\n" + "NOTE : "+ o.getCDListInstruction());
    console.log(info)

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/addcollection.json", info).subscribe(
        response => {
          let res;
          res = response;
          console.log(res)
        },
        err => {
          console.log(err)
          resolve(false)
        }
      );

    }).catch(err => {
      console.log(err)
    })
  }


}
