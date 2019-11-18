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
export class AccountsService {

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

  login(info: any) {
    console.log(info)
    let infox = {
      email: "it01.azaza@gmail.com",
      password: "7c222fb2927d828af22f592134e8932480637c0d"
    }

    return new Promise(resolve => {
      this.httpclient.post(this.url+"/logon.json", infox).subscribe(
        response => {
          let res;
          res = response;
          this.storage.set('accounts_table', res[0]).then(() => {

          });
  
          resolve(res)
          // console.log(res)
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
