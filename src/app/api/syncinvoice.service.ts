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

  todaydate: any

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
        "email": "it01.azaza@gmail.com",
        "password": "7c222fb2927d828af22f592134e8932480637c0d",
        // 'Authorization': 'Bearer ' + token
      })
    };
  }

  getToday() {
    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let hr = new Date().getHours();
    let min = new Date().getMinutes();
    let ss = new Date().getSeconds();
    let yy = (yyyy + '').substr(2, 2);

    today = yyyy + '-' + mm + '-' + dd + " " + hr + ":" + min + ":" + ss;
    this.todaydate = today
    console.log(this.todaydate)
  }

  checkOverDue(info: any) {
    //address.setText(o.getCDListAddress() + "\n" + o.getCDListUnit() + " S" +o.getCDListPostal() + "\n" + o.getCDListBuilding() +  "\n" + "NOTE : "+ o.getCDListInstruction());
    
    console.log(info)
  

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/addcollection.json", info).subscribe(
        response => {
          let res;
          res = response;
          console.log(res)

          // this.storage.set('SYNCED_INVOICE_TABLE', res).then(() => {
          //   resolve(res)
          // });

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



  syncInvoice(info: any) {

    let infox = {
      // email: info.email_address,
      // password: info.password
      'agreeddeliverydate' : '2019-12-08',
      "bags" : "1",
      "balancepaid" : "0.00",
     // "collectionid" : "141132",
      "collectionid" : "312B Sumang Link06-175 S822312NOTE : 10-12NN. Onsite Sofa Cleaning. Quoted $295. ",
      "customerid" : "27866",
      "deliverytimeslot" : "J 6 - 8pm",
      "depositamount" : "2",
      "deposittype" : "Cash",
      "discount" : 1.20,
      "donatetotal" : "0",
      "email" : "davidchia@cottoncare.com.sg",
      "express" : 1,
      "hasdonate" : "0",
      "initial" : "DC",
      // "invoiceitem" : "{'id':'77','description':'Carpet Shaggy Type','cat_type':'Carpet','clean_type':'Dry Clean','ready_type':'Pack','price':'3.00','updated_by':'admin','updated_on':'2016-06-17 04:28:39','item_ready':'no','qty':1,'pcs':2,'subtotal':3,'rid':'141913'}",
      //"invoiceitem" : "{[\"description\":\"Carpet Shaggy Type\",\"cat_type\":\"Carpet\",\"clean_type\":\"Dry Clean\",\"ready_type\":\"Pack\",\"price\":\"3.00\",\"item_ready\":\"no\",\"qty\":\"1\",\"pcs\":\"2\"]}",
      "invoiceitem" : "",
      "invoiceno" : "CC-19129Ch05",
      "invoicenote" : "[test]",
      "name" : "Chia",
      "password" : "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
      "savedon" : this.todaydate,
      "type" : "39"
    }

    //address.setText(o.getCDListAddress() + "\n" + o.getCDListUnit() + " S" +o.getCDListPostal() + "\n" + o.getCDListBuilding() +  "\n" + "NOTE : "+ o.getCDListInstruction());
    
    console.log(info)
  

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/addinvoice.json", info).subscribe(
        response => {
          let res;
          res = response;
          console.log(res)

          // this.storage.set('SYNCED_INVOICE_TABLE', res).then(() => {
          //   resolve(res)
          // });

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
