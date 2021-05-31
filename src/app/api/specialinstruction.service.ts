import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { CollectionitemsPageModule } from '../collectionitems/collectionitems.module';


@Injectable({
  providedIn: 'root'
})
export class SpecialinstructionService {

  private endpoint = environment.endpoint;
  private url = this.endpoint;
  loading: any = new LoadingController;

  constructor(
    private httpclient: HttpClient,
    public loadingCtrl: LoadingController,
    private storage: Storage,
  ) { }


  getSpecialInstruction(info: any, today) {

    let params = {
      "date": today,
      "email": info.email_address,
      "password": info.password,
      "driverid": info.id,
    }

    // let params = {
    //   "date": today,
    //   "email": "it01.azaza@gmail.com",
    //   "password": "7c222fb2927d828af22f592134e8932480637c0d",
    //   "driverid": "109",
    //  }

    ////console.log(info)
    ////console.log(today)

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/specialinstructions.json", params).subscribe(
        response => {
          let res;
          res = response;
          ////console.log(res)
            resolve(res)
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

  delSpecialInstruction(info: any, today, coldelSplID) {
    
    let params = {
      "date": today,
      "email": info.email_address,
      "password": info.password,
      "driverid": info.id,
      "id": coldelSplID,
     }

    //  let params = {
    //   "date": today,
    //   "email": "it01.azaza@gmail.com",
    //   "password": "7c222fb2927d828af22f592134e8932480637c0d",
    //   "driverid": "109",
    //   "id": coldelSplID,
    //  }

    ////console.log(params)

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/deletespecialinstructions.json", params).subscribe(
        response => {
          let res;
          res = response;
          ////console.log(res)
            resolve(res)
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
