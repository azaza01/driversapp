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
// import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private endpoint = environment.endpoint;
  private url = this.endpoint;

  loading: any = new LoadingController;
  driverData: any;
  require: any 


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

  async accountsDetails() {
    return new Promise(resolve => {
      this.storage.get('ACCOUNTS_TABLE').then(res => {
        console.log(res);
        this.driverData = res
        resolve(res)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  getCustomer(info) {

    let params: any = {
     email : "it01.azaza@gmail.com",
     password : "7c222fb2927d828af22f592134e8932480637c0d",
     userid : "109",
     drivername : "dummydriver",
     contactno : info.contactno,
     postal : info.postal
    }
  
    return new Promise(resolve => {
      this.httpclient.post(this.url + "/customer.json", params).subscribe(
        response => {
          let res;
          res = response;
          console.log(res)
          this.storage.set('SELECTED_CUSTOMER', res[0]).then(() => {

          });
          resolve(res)
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


  addCustomerStandingOrder(info) {
    console.log(info)
    // this.storage.get('ACCOUNTS_TABLE').then(res => {
    //   console.log(res);
    //   this.driverData = res
    // })

    let params: any = {}
      params.email = "it01.azaza@gmail.com"
      params.password = "7c222fb2927d828af22f592134e8932480637c0d"
      params.userid = "109",
      params.drivername = "dummydriver",
      //params.userid = this.driverData.id,
      //params.email = this.driverData.email_address,
      //params.password = this.driverData.password,
      //params.name = this.driverData.name,
      params.companyagent = info.companyagent,
      params.contactperson1 = info.contactperson1,
      params.contactno1 = info.contactno1,
      params.mailingaddress = info.mailingaddress,
      params.unitno = info.unitno,
      params.builidngname = info.builidngname,
      params.postalcode = info.postalcode,
      params.liftlobby = info.liftlobby,
      params.areacode = info.areacode,
      params.contactno2 = info.contactno2,
      params.emailcus = info.emailcus,
      params.contactperson2 = info.contactperson2,
      params.customertype = info.customertype,


    console.log(params)
    
    return new Promise(resolve => {
      this.httpclient.post(this.url + "/addcustomerdata.json", params).subscribe(
        response => {
          let returndata = response
          params.customerid = returndata
          let newdata: any [] = params
          resolve(newdata)
        },
        err => {
          console.log(err)
          resolve(err)

          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      console.log(err)
    })
  }

  login(info: any) {
    console.log(info)
    console.log(info.password)


    // convert password to sha1 
    
    // var sha1 = require('sha1');
    // var hash = CryptoJS.SHA1(info.password);
    // var generatedpassword  = sha1(info.password);
    if(info.email == "ken@cottoncare.com.sg" && info.password == "blessed878"){
      info.password = "47cdb5462d98cef63f51176a007e93aea4b7f5b9";
    }else if(info.email == "eddieang@cottoncare.com.sg" && info.password == "charmed878"){
      info.password = "df09c6ab678521d4b937f4bd3087d5233575ae92";
    }else if(info.email == "davidchia@cottoncare.com.sg" && info.password == "fortune878"){
      info.password = "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d";
    }else if(info.email == "riziano@cottoncare.com.sg" && info.password == "lucky878"){
      info.password = "f3bd2a65e77ea0bc22eb0d5ce2b917a0acff51f2";
    }else if(info.email == "dian@cottoncare.com.sg" && info.password == "goodluck878"){
      info.password = "6fe2e53fa851cd6ffe4134f80b95aaad8a5ee6ea";
    }else if(info.email == "ibrahim@cottoncare.com.sg" && info.password == "jammy878"){
      info.password = "af968298964d79344879624ff2bce33a11dfb5e8";
    }else if(info.email == "ting@cottoncare.com.sg" && info.password == "prosper878"){
      info.password = "edc14f34351522e04fc9b76cd5ce06838f4c5693";
    }else if(info.email == "selfcollect@cottoncare.com.sg" && info.password == "clover878"){
      info.password = "5dda79f899fa627cb331737eaa4a96b68046d0c4";
    }else if(info.email == "superb@cottoncare.com.sg" && info.password == "clover878"){
      info.password = "hash";
    }else if(info.email == "ckwoo@cottoncare.com.sg" && info.password == "escape@878"){
      info.password = "hash";
    }else if(info.email == "rosli@cottoncare.com.sg" && info.password == "escape@878"){
      info.password = "hash";
    }else if(info.email == "it01.azaza@gmail.com" && info.password == "12345678"){
      info.password = "7c222fb2927d828af22f592134e8932480637c0d";
    }



    console.log(info.password);

    let infoi = {
      // email: "it01.azaza@gmail.com",
      // password: "7c222fb2927d828af22f592134e8932480637c0d"
      "email": "it01.azaza@gmail.com",
      "password": "7c222fb2927d828af22f592134e8932480637c0d",
    }

    let infox = {
      // email: "it01.azaza@gmail.com",
      // password: "7c222fb2927d828af22f592134e8932480637c0d"
      "email": "riziano@cottoncare.com.sg",
      "password": "f3bd2a65e77ea0bc22eb0d5ce2b917a0acff51f2",
    }

    if (navigator.onLine == true) {
      return new Promise(resolve => {
        this.httpclient.post(this.url + "/logon.json", infoi).subscribe(
          response => {
            let res;
            res = response[0];
            // console.log(res)
            this.driverData = res
            this.storage.set('ACCOUNTS_TABLE', res).then(() => {
              // this.getStandingOrder(res)
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
        return new Promise(resolve => {
          this.storage.get('ACCOUNTS_TABLE').then(res => {
            console.log(res);
            this.driverData = res
            if(res.email_address == info.email && res.password == info.password){
              resolve(res)
            }else{
  
            }
          })
        }).catch(err => {
          console.log(err)
        })
      })
    }else{
      return new Promise(resolve => {
        this.storage.get('ACCOUNTS_TABLE').then(res => {
          console.log(res);
          this.driverData = res
          if(res.email_address == info.email && res.password == info.password){
            resolve(res)
          }else{

          }
        })
      }).catch(err => {
        console.log(err)
      })
    }



  }

  getStandingOrder(info) {
    let params = {
      userid: info.id,
      email: info.email_address,
      password: info.password
    }

    // let params = {
    //   "email": "it01.azaza@gmail.com",
    //   "password": "7c222fb2927d828af22f592134e8932480637c0d",
    //   "userid": "109",
    //  }

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/standingorder.json", params).subscribe(
        response => {
          let res;
          res = response[0];
          // console.log(res)
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
