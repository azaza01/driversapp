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
export class SyncdeliveryService {

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

  async syncdeliverysrvcLocal(info: any) {
    // console.log(info)
    let infox = {
      // email   :   "davidchia@cottoncare.com.sg",
      // password   :   "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
      // delid   :   "124094", //pass coldelID (actually is delID) and ws gets the invid
      // nowpaid   :   "10", // must add the Last Paid field together
      // lastpaid   :   "45", // should have a field that sends back the previous payment to add up the last deposit with last paid so this current payment can be tracked in settlement
      // balancepaid   :   "65", // must add the Last Paid field together because we are updating the balance paid field
      // balancetype   :   "Cash",
      // status   :   "Partial Delivered, Full Paid",
      // ppdate   :   "2019-12-07", //06-05-2013
      // pptimeslot   :   "O Any Time", //06-05-2013
      // name   :   "Chia",
      // savedon   :  this.today
      //CC-191207Ch23
    }
    await this.presentLoading('Syncing Delivery');
    return new Promise(resolve => {
      this.httpclient.post(this.url + "/updateinvoicestatus.json", info).subscribe(
        response => {
          let res;
          res = response;
          // console.log(res)
          // this.storage.set('SYNCED_DELIVERY_TABLE', res).then(() => {
          resolve(res)
          // });
          this.loading.dismiss();
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
      this.loading.dismiss();
    })
  }


  async syncdeliverysrvc(info: any) {
    console.log(info)
    // let infox = {
    //   email   :   "davidchia@cottoncare.com.sg",
    //   password   :   "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
    //   delid   :   "124094", //pass coldelID (actually is delID) and ws gets the invid
    //   nowpaid   :   "10", // must add the Last Paid field together
    //   lastpaid   :   "45", // should have a field that sends back the previous payment to add up the last deposit with last paid so this current payment can be tracked in settlement
    //   balancepaid   :   "65", // must add the Last Paid field together because we are updating the balance paid field
    //   balancetype   :   "Cash",
    //   status   :   "Partial Delivered, Full Paid",
    //   ppdate   :   "2019-12-07", //06-05-2013
    //   pptimeslot   :   "O Any Time", //06-05-2013
    //   name   :   "Chia",
    //   savedon   :  this.today
    //   //CC-191207Ch23
    // }
    await this.presentLoading('Syncing Payments');
    return new Promise(resolve => {
      this.httpclient.post(this.url + "/updateinvoicestatus.json", info).subscribe(
        response => {
          let res;
          res = response;
          // console.log(res)
          // this.storage.set('SYNCED_DELIVERY_TABLE', res).then(() => {
            resolve(res)
          // });
          this.loading.dismiss();
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
      this.loading.dismiss();
    })
  }
}
