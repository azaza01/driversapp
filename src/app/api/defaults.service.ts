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
export class DefaultsService {

  private endpoint = environment.endpoint;
  private url = this.endpoint;
  loading: any = new LoadingController;

  prepended_number: any

  resultINVNUM: any
  myInvoiceNumber: any

  driversDetails: any
  nextcountdaysCol: any = 0
  nextcountdaysDel: any = 0
  prevcountdaysCol: any = 0
  prevcountdaysDel: any = 0

  mySelectedDate: any 
  mySelectedDateCollection: any 
  mySelectedDateDelivery: any 

  checkAllSucess: any = "1"

  _category: any;
  set getCategory(value: any) {
    this._category = value;
  }
  get getCategory(): any {
    return this._category;
  }

  _tempItems: any;
  set getTempItems(value: any) {
    this._tempItems = value;
  }
  get getTempItems(): any {
    return this._tempItems;
  }

  _selectedItem: any;
  set getSelectedItem(value: any) {
    this._selectedItem = value;
  }
  get getSelectedItem(): any {
    return this._selectedItem;
  }

  constructor(
    private httpclient: HttpClient,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private accSrvc: AccountsService,
    private network: Network
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

  checkConnection() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      ////console.log('network was disconnected :-(');
    });
    // ////console.log(disconnectSubscription)

  }

  getToday() {
    this.nextcountdaysCol = 0
    this.nextcountdaysDel = 0


    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let yy = (yyyy + '').substr(2, 2);

    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm


    today = yyyy + '-' + mmm + '-' + ddd ;

    ////console.log(today)
    return today
  }

  getTodayColDel() {
    this.nextcountdaysCol = 0
    this.nextcountdaysDel = 0


    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let yy = (yyyy + '').substr(2, 2);

    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm


    today = yyyy + '-' + mmm + '-' + ddd ;

    this.mySelectedDate = today
    ////console.log(today)
    return today
  }

  getOthersCol(operation,countdays) {
    console.log(countdays)

    this.nextcountdaysCol = (this.nextcountdaysCol * 1) + (countdays * 1)
    ////console.log(this.nextcountdaysCol)
    let today;
    
    // let dd = new Date().getDate() + this.nextcountdaysCol;
    // let mm = new Date().getMonth() + 1;
    // let yyyy = new Date().getFullYear();
    // let yy = (yyyy + '').substr(2, 2);

    today = new Date(countdays);
    var nextdate
    if(operation == "plus"){
      nextdate = new Date(today.getFullYear(),today.getMonth(),today.getDate() + 1);
    }else if(operation == "minus"){
      nextdate = new Date(today.getFullYear(),today.getMonth(),today.getDate() - 1);
    }



    // var now = new Date();
    // var mydays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    // console.log(mydays)
    // console.log(dd)

    // if (mm == 12 && dd == 32) {
    //   dd = 1
    //   mm = 1
    //   yyyy = (yyyy * 1) + 1

    //   let ddd = dd < 10 ? "0" + dd : dd
    //   let mmm = mm < 10 ? "0" + mm : mm
  
    //   today = yyyy + '-' + mmm + '-' + ddd ;
    // } else if (mydays == dd && mm != 12){
    //   dd = 1
    //   mm = (mm * 1) + 1

    //   let ddd = dd < 10 ? "0" + dd : dd
    //   let mmm = mm < 10 ? "0" + mm : mm
  
    //   today = yyyy + '-' + mmm + '-' + ddd ;
    // }else{
    //   let ddd = dd < 10 ? "0" + dd : dd
    //   let mmm = mm < 10 ? "0" + mm : mm
  
    //   today = yyyy + '-' + mmm + '-' + ddd ;
    // }
    // console.log(today)

    this.mySelectedDateCollection = nextdate

    let dd = new Date(this.mySelectedDateCollection).getDate();
    let mm = new Date(this.mySelectedDateCollection ).getMonth() + 1;
    let yyyy = new Date(this.mySelectedDateCollection ).getFullYear();
    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm
    let selectedDate = yyyy + '-' + mmm + '-' + ddd ;
    console.log(selectedDate)

    console.log(this.mySelectedDateCollection)
    return selectedDate
  }

  getOthersDel(operation,countdays) {
    console.log(countdays)
    this.nextcountdaysDel = (this.nextcountdaysDel * 1) + (countdays * 1)
    ////console.log(this.nextcountdaysDel)
    let today;
    // let dd = new Date().getDate() + this.nextcountdaysDel;
    // let mm = new Date().getMonth() + 1;
    // let yyyy = new Date().getFullYear();
    // let yy = (yyyy + '').substr(2, 2);

    // var now = new Date();
    // var mydays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    today = new Date(countdays);
    var nextdate
    if(operation == "plus"){
      nextdate = new Date(today.getFullYear(),today.getMonth(),today.getDate() + 1);
    }else if(operation == "minus"){
      nextdate = new Date(today.getFullYear(),today.getMonth(),today.getDate() - 1);
    }

    // if (mm == 12 && dd == 32) {
    //   dd = 1
    //   mm = 1
    //   yyyy = (yyyy * 1) + 1

    //   let ddd = dd < 10 ? "0" + dd : dd
    //   let mmm = mm < 10 ? "0" + mm : mm
  
    //   today = yyyy + '-' + mmm + '-' + ddd ;
    // } else if (mydays == dd && mm != 12){
    //   dd = 1
    //   mm = (mm * 1) + 1

    //   let ddd = dd < 10 ? "0" + dd : dd
    //   let mmm = mm < 10 ? "0" + mm : mm
  
    //   today = yyyy + '-' + mmm + '-' + ddd ;
    // }else{
    //   let ddd = dd < 10 ? "0" + dd : dd
    //   let mmm = mm < 10 ? "0" + mm : mm
  
    //   today = yyyy + '-' + mmm + '-' + ddd ;
    // }
    // console.log(today)

    this.mySelectedDateDelivery = nextdate

    let dd = new Date(this.mySelectedDateDelivery).getDate();
    let mm = new Date(this.mySelectedDateDelivery).getMonth() + 1;
    let yyyy = new Date(this.mySelectedDateDelivery).getFullYear();
    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm
    let selectedDate = yyyy + '-' + mmm + '-' + ddd ;
    console.log(selectedDate)

    console.log(this.mySelectedDateDelivery)
    
    return selectedDate
  }

  // getPrevDayCol(countdays) {
  //   this.prevcountdaysCol = (this.prevcountdaysCol * 1) -  (countdays * 1)
  //   ////console.log(this.prevcountdaysCol)
  //   let today;
    
  //   let dd = new Date().getDate() - this.prevcountdaysCol;
  //   let mm = new Date().getMonth() + 1;
  //   let yyyy = new Date().getFullYear();
  //   let yy = (yyyy + '').substr(2, 2);

  //   let ddd = dd < 10 ? "0" + dd : dd
  //   let mmm = mm < 10 ? "0" + mm : mm


  //   today = yyyy + '-' + mmm + '-' + ddd ;
  //   this.mySelectedDate = today
  //   ////console.log(today)
  //   return today
  // }

  // getPrevDayDel(countdays) {
  //   this.prevcountdaysDel = (this.prevcountdaysDel * 1) -  (countdays * 1)
  //   ////console.log(this.prevcountdaysDel)
  //   let today;
  //   let dd = new Date().getDate() - this.prevcountdaysDel;
  //   let mm = new Date().getMonth() + 1;
  //   let yyyy = new Date().getFullYear();
  //   let yy = (yyyy + '').substr(2, 2);

  //   let ddd = dd < 10 ? "0" + dd : dd
  //   let mmm = mm < 10 ? "0" + mm : mm


  //   today = yyyy + '-' + mmm + '-' + ddd ;
  //   this.mySelectedDate = today
  //   ////console.log(today)
  //   return today
  // }

  createInvSeries() {
    // this.storage.remove('ENVNUM_TABLE').then(res => {
    //   ////console.log('remove')
    // })
    // this.storage.get('ENVNUM_TABLE').then(res => {
    //   ////console.log(res)
    // })
    // return

    return new Promise(resolve => {

      let seriesTbl: any = []
      let params: any = {};
      // params.COLID = info
      params.INV_DATE = this.getToday()
      params.INV_TYPE = "CC"
      let dd = new Date().getDate();
      let mm = new Date().getMonth() + 1;
      let yyyy = new Date().getFullYear();
      let yy = (yyyy + '').substr(2, 2);

      this.prepended_number = String(dd).padStart(2, '0')
      let mmm = String(mm).padStart(2, '0')

      let seriesNo;
      let driver;
      this.storage.get('ACCOUNTS_TABLE').then(res => {
        driver = res
        params.drivercode = res.code
        // ////console.log(driver)
      })

      //CC-191123AG01
      // ////console.log(params)

      this.storage.get('ENVNUM_TABLE').then(res => {
        // ////console.log(res)
        res = null ? seriesTbl = [] : seriesTbl = res
        // ////console.log(seriesTbl)
        // return
        if (seriesTbl != null) {
          let result;
          result = seriesTbl.filter((item) => {
            return (item.INV_DATE.indexOf(params.INV_DATE) !== -1 && item.drivercode == params.drivercode )
          })

          if (result.length < 1) {
            // ////console.log("1st");
            params.INV_RUNNING = 1
            let num = params.INV_RUNNING < 10 ? "0" + params.INV_RUNNING : params.INV_RUNNING

            seriesNo = params.INV_TYPE + "-" + yy + mmm + (dd < 10 ? '0' + dd : dd) + driver.code + num
            params.INV_NO = seriesNo
            seriesTbl.push(params)

            //this.storage.set('ENVNUM_TABLE', seriesTbl)

            // ////console.log(seriesNo)
            // ////console.log(seriesTbl)
            resolve(params)
          } else {
            // res.forEach(coldelData => {
            //   if (coldelData.COLID == info) {
            //     ////console.log(true)
            //     this.resultINVNUM = true
            //     this.myInvoiceNumber = coldelData.INV_NO 
            //   } 
            // })

            // if(this.resultINVNUM != true){
            //   ////console.log(false)
            // ////console.log("2nd");
            let maxSeries = Math.max.apply(Math, result.map(function (o) { return o.INV_RUNNING; }))
            params.INV_RUNNING = parseInt(maxSeries) + 1
            let num = params.INV_RUNNING < 10 ? "0" + params.INV_RUNNING : params.INV_RUNNING
            seriesNo = params.INV_TYPE + "-" + yy + mmm + (dd < 10 ? '0' + dd : dd) + driver.code + num
            params.INV_NO = seriesNo
            // ////console.log(params)
            seriesTbl.push(params)

            //this.storage.set('ENVNUM_TABLE', seriesTbl)

            // ////console.log(seriesNo)
            // ////console.log(seriesTbl)
            resolve(params)
            // }else{
            //   ////console.log(this.myInvoiceNumber)
            //   resolve(this.myInvoiceNumber)
            // }
          }
        } else {
          // ////console.log("3rd");
          params.INV_RUNNING = 1
          seriesTbl = []
          let num = params.INV_RUNNING < 10 ? "0" + params.INV_RUNNING : params.INV_RUNNING
          seriesNo = params.INV_TYPE + "-" + yy + mmm + (dd < 10 ? '0' + dd : dd) + driver.code + num
          params.INV_NO = seriesNo
          seriesTbl.push(params)

          //this.storage.set('ENVNUM_TABLE', seriesTbl)

          // ////console.log(seriesNo)
          // ////console.log(seriesTbl)
          resolve(params)
        }
      })

    }).catch(err => {
      ////console.log(err)
    })

    // var result = Number(n) + 1;
    //     if ( result < 10 ) {
    //         return "0" + result;
    //     } else {
    //         return result;
    // }
    // this.storage.set('ENVNUM_TABLE', info)
  }

  clearsyncsStorage() {
    this.storage.remove('ITEMS_TABLE')
    this.storage.remove('RATES_TABLE')
    this.storage.remove('AREAS_TABLE')
    this.storage.remove('INVOICE_TYPES_TABLE')
    this.storage.remove('DISCOUNT_TYPES_TABLE')
    this.storage.remove('TIMESLOT_TABLE')
    this.storage.remove('FB_FORM_TABLE')
    this.storage.remove('UNSYNCED_PAYMENT_TABLE')

  }

  async syncAll(driverInfo) {
    this.checkAllSucess =  "1"
    return new Promise(resolve => {
      Promise.resolve(this.getItems(driverInfo)).then(data => {
        console.log('ITEMS_TABLE', data);
        this.loading.dismiss();
        if(data != "false"){
          this.checkAllSucess = this.checkAllSucess + "2"
        }else{
          resolve(this.checkAllSucess)
        }
        Promise.resolve(this.getRates(driverInfo)).then(data => {
          console.log('RATES_TABLE', data);
          this.loading.dismiss();
          if(data != "false"){
            this.checkAllSucess = this.checkAllSucess + "3"
          }else{
            resolve(this.checkAllSucess)
          }
          Promise.resolve(this.getRegions(driverInfo)).then(data => {
            ////console.log('AREAS_TABLE', data);
            this.loading.dismiss();
            if(data != "false"){
              this.checkAllSucess = this.checkAllSucess + "4"
            }else{
              resolve(this.checkAllSucess)
            }
            
            Promise.resolve(this.getInvoicetypes(driverInfo)).then(data => {
             //console.log('INVOICE_TYPES_TABLE', data);
              this.loading.dismiss();
              if(data != "false"){
                this.checkAllSucess = this.checkAllSucess + "5"
              }else{
                resolve(this.checkAllSucess)
              }
              Promise.resolve(this.getDiscounts(driverInfo)).then(data => {
                ////console.log('DISCOUNT_TYPES_TABLE', data);
                this.loading.dismiss();
                if(data != "false"){
                  this.checkAllSucess = this.checkAllSucess + "6"
                }else{
                  resolve(this.checkAllSucess)
                }
                Promise.resolve(this.getTimeslot(driverInfo)).then(data => {
                  ////console.log('TIMESLOT_TABLE', data);
                  this.loading.dismiss();
                  if(data != "false"){
                    this.checkAllSucess = this.checkAllSucess + "7"
                  }else{
                    resolve(this.checkAllSucess)
                  }
                  Promise.resolve(this.getFeedback(driverInfo)).then(data => {
                    ////console.log('FB_FORM_TABLE', data);
                    this.loading.dismiss();
                    if(data != "false"){
                      this.checkAllSucess = this.checkAllSucess + "8"
                    }else{
                      resolve(this.checkAllSucess)
                    }
                    Promise.resolve(this.getAreas(driverInfo)).then(data => {
                      ////console.log('areas', data);
                      this.loading.dismiss();
                      if(data != "false"){
                        this.checkAllSucess = this.checkAllSucess + "9"
                      }else{
                        resolve(this.checkAllSucess)
                      }
                    // this.storage.set('UNSYNCED_PAYMENT_TABLE', '').then(() => {
                      Promise.resolve(this.customerType(driverInfo)).then(data => {
                        ////console.log('customertyp', data);
                        this.loading.dismiss();
                        if(data != "false"){
                          this.checkAllSucess = this.checkAllSucess + "10"
                          resolve(this.checkAllSucess)
                        }else{
                          resolve(this.checkAllSucess)
                        }

                         // let params: any = {
                          //   invoicecompany: 0,
                          //   invoicetype: 0,
                          //   amount: 0,
                          //   paidtype: 0,
                          //   noofcol: 0,
                          //   nofodel: 0,
                          //   driversid: 0,
                          //   date: 0,
                          //   invoiceno: 0
                          // }
                          // this.storage.set('DRIVER_SUMMARY', "").then(() => {
                          // })

                        // this.storage.set('UNSYNCED_PAYMENT_TABLE', '').then(() => {
                      // this.storage.set('UNSYNCED_EMAILS_TABLE', '').then(() => {
                 
                      // });
                    // });

                  }).catch(e => {
                    this.checkAllSucess = "1"
                    this.loading.dismiss();
                    ////console.log(e);
                  });

                  }).catch(e => {
                    this.checkAllSucess = "1"
                    this.loading.dismiss();
                    ////console.log(e);
                  });

                  }).catch(e => {
                    this.checkAllSucess = "1"
                    this.loading.dismiss();
                    ////console.log(e);
                  });

                }).catch(e => {
                  this.checkAllSucess = "1"
                  this.loading.dismiss();
                  ////console.log(e);
                });

              }).catch(e => {
                this.checkAllSucess = "1"
                this.loading.dismiss();
                ////console.log(e);
              });

            }).catch(e => {
              this.checkAllSucess = "1"
              this.loading.dismiss();
              ////console.log(e);
            });

          }).catch(e => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(e);
          });

        }).catch(e => {
          this.checkAllSucess = "1"
          this.loading.dismiss();
          ////console.log(e);
        });

      }).catch(e => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(e);
      });
    }).catch(err => {
      this.checkAllSucess = "1"
      this.loading.dismiss();
      ////console.log(err)
    })

  }

  getitemsLocal(info: any){
        return new Promise(resolve => {
          this.storage.get('ITEMS_TABLE').then(res => {
            resolve(res)
          })
        }).catch(err => {
          ////console.log(err)
        })
  }

  getItems(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching items');
      let params = {
        email: info.email_address,
        password: info.password
      }
      return new Promise(resolve => {
        this.httpclient.post(this.url + "/items.json", params).subscribe(
          response => {
            let res;
            res = response;
            ////console.log(res)
            this.storage.set('ITEMS_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });
          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)

            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.checkAllSucess = "1"
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('ITEMS_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }

  customerType(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching customer types');
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/customertype.json", params).subscribe(
          response => {
            let res;
            res = response;
            ////console.log(res)

            this.storage.set('CUSTOMERTYPE_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });

          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)

            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('CUSTOMERTYPE_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }

  getAreas(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching areas');
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/getAreas.json", params).subscribe(
          response => {
            let res;
            res = response;
            ////console.log(res)

            this.storage.set('AREAS_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });

          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)

            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.loading.dismiss();
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('AREAS_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }

  getRatesLocal(info: any){
        return new Promise(resolve => {
          this.storage.get('RATES_TABLE').then(res => {
            // ////console.log(res);
            this.loading.dismiss();
            resolve(res)
          })
        }).catch(err => {
          this.checkAllSucess = "1"
          this.loading.dismiss();
          ////console.log(err)
        })
  }

  getRates(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching items');
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/rates.json", params).subscribe(
          response => {
            let res;
            res = response;
            // ////console.log(res)

            this.storage.set('RATES_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });

          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)
            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('RATES_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }


  getRegions(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching regions');
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/regions.json", params).subscribe(
          response => {
            let res;
            res = response;
            // ////console.log(res)

            this.storage.set('AREAS_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });
          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)

            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('AREAS_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }

  getInvoicetypes(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching invoice types');
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/invoicetypes.json", params).subscribe(
          response => {
            let res;
            res = response;
            // ////console.log(res)

            this.storage.set('INVOICE_TYPES_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });

          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)

            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('INVOICE_TYPES_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }

  getDiscounts(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching discounts');
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/discounts.json", params).subscribe(
          response => {
            let res;
            res = response;
            // ////console.log(res)

            this.storage.set('DISCOUNT_TYPES_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });

          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)

            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.loading.dismiss();
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('DISCOUNT_TYPES_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }

  getTimeslot(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching timeslots');
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/timeslots.json", params).subscribe(
          response => {
            let res;
            res = response;
            // ////console.log(res)

            this.storage.set('TIMESLOT_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });

          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)

            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('TIMESLOT_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }

  getFeedback(info: any) {
    if (navigator.onLine == true) {
      this.presentLoading('synching feedbacks');
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/feedback.json", params).subscribe(
          response => {
            let res;
            res = response;
            // ////console.log(res)

            this.storage.set('FB_FORM_TABLE', res).then(() => {
              this.loading.dismiss();
              resolve(res)
            });

          },
          err => {
            this.checkAllSucess = "1"
            this.loading.dismiss();
            ////console.log(err)
            resolve(false)

            // alert(JSON.stringify(err));
          }
        );

      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    } else {
      return new Promise(resolve => {
        this.storage.get('FB_FORM_TABLE').then(res => {
          // ////console.log(res);
          this.loading.dismiss();
          resolve(res)
        })
      }).catch(err => {
        this.checkAllSucess = "1"
        this.loading.dismiss();
        ////console.log(err)
      })
    }
  }


  getSpecialIns(info: any) {
    let params = {
      email: info.email_address,
      password: info.password
    }

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/specialinstructions.json", params).subscribe(
        response => {
          let res;
          res = response;
          // ////console.log(res)

          // this.storage.set('FB_FORM_TABLE', res).then(() => {
          //   resolve(res)
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

  getInvoiceType(info: any) {
    let params = {
      email: info.email_address,
      password: info.password
    }

    return new Promise(resolve => {
      this.httpclient.post(this.url + "/invoicetypes.json", params).subscribe(
        response => {
          let res;
          res = response;
          // ////console.log(res)

          // this.storage.set('FB_FORM_TABLE', res).then(() => {
          //   resolve(res)
          // });

        },
        err => {
          this.checkAllSucess = "1"
          ////console.log(err)
          resolve(false)

          // alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      this.checkAllSucess = "1"
      ////console.log(err)
    })
  }

}
