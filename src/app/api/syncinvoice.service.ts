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
        'email' : 'davidchia@cottoncare.com.sg',
        'password' : '585ae7c2bcd0b7409c9be2edc4b117e22a51b33d'
        // 'Authorization': 'Bearer ' + token
      })
    };
  }


  syncInvoice(info: any) {
    console.log(info)
    let infox = {
      // email: info.email_address,
      // password: info.password
      "agreeddeliverydate" : "0000-00-00",
      "bags" : "1",
      "balancepaid" : "0.00",
      "collectionid" : "141913",
      "customerid" : "24047",
      "deliverytimeslot" : "A 10 - 12pm",
      "depositamount" : "2",
      "deposittype" : "CASH",
      "discount" : 1.20,
      "donatetotal" : "1",
      "email" : "davidchia@cottoncare.com.sg",
      "express" : 1,
      "hasdonate" : "1",
      "initial" : "DC",
      // "invoiceitem" : "{'id':'77','description':'Carpet Shaggy Type','cat_type':'Carpet','clean_type':'Dry Clean','ready_type':'Pack','price':'3.00','updated_by':'admin','updated_on':'2016-06-17 04:28:39','item_ready':'no','qty':1,'pcs':2,'subtotal':3,'rid':'141913'}",
      "invoiceitem" : "{\"description\":\"Carpet Shaggy Type\",\"cat_type\":\"Carpet\",\"clean_type\":\"Dry Clean\",\"ready_type\":\"Pack\",\"price\":\"3.00\",\"item_ready\":\"no\",\"qty\":1,\"pcs\":2}",
      "invoiceno" : "CC-19129Ch03",
      "invoicenote" : "test",
      "name" : "Chia",
      "password" : "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
      "savedon" : "Sat Dec 07 2019 13:18:50 GMT+0800 (Philippine Standard Time)",
      "type" : "New"
    }

    return new Promise(resolve => {
      this.getHeaders()
      this.httpclient.post(this.url + "/addinvoice.json", infox, this.getHeaders()).subscribe(
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
