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
      console.log('network was disconnected :-(');
    });
    // console.log(disconnectSubscription)

  }

  getToday() {
    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let yy = (yyyy + '').substr(2, 2);

    today = yyyy + '-' + mm + '-' + dd;
    console.log(today)
    return today
  }

  createInvSeries() {
    // this.storage.remove('ENVNUM_TABLE').then(res => {
    //   console.log('remove')
    // })
    // this.storage.get('ENVNUM_TABLE').then(res => {
    //   console.log(res)
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

      let seriesNo;
      let driver;
      this.storage.get('ACCOUNTS_TABLE').then(res => {
        driver = res
        // console.log(driver)
      })

      //CC-191123AG01
      // console.log(params)

      this.storage.get('ENVNUM_TABLE').then(res => {
        // console.log(res)
        res = null ? seriesTbl = [] : seriesTbl = res
        // console.log(seriesTbl)
        // return
        if (seriesTbl != null) {

          let result;
          result = seriesTbl.filter((item) => {
            return (item.INV_DATE.indexOf(params.INV_DATE) !== -1)
          })

          if (result.length < 1) {
            // console.log("1st");
            params.INV_RUNNING = 1
            let num = params.INV_RUNNING < 10 ? "0" + params.INV_RUNNING : params.INV_RUNNING
            seriesNo = params.INV_TYPE + "-" + yy + mm + (dd < 10 ? '0' + dd : dd) + driver.code + num
            params.INV_NO = seriesNo
            seriesTbl.push(params)

            this.storage.set('ENVNUM_TABLE', seriesTbl)
            // console.log(seriesNo)
            // console.log(seriesTbl)
            resolve(seriesNo)
          } else {
            // res.forEach(coldelData => {
            //   if (coldelData.COLID == info) {
            //     console.log(true)
            //     this.resultINVNUM = true
            //     this.myInvoiceNumber = coldelData.INV_NO 
            //   } 
            // })

            // if(this.resultINVNUM != true){
            //   console.log(false)
            // console.log("2nd");
            let maxSeries = Math.max.apply(Math, result.map(function (o) { return o.INV_RUNNING; }))
            params.INV_RUNNING = parseInt(maxSeries) + 1
            let num = params.INV_RUNNING < 10 ? "0" + params.INV_RUNNING : params.INV_RUNNING
            seriesNo = params.INV_TYPE + "-" + yy + mm + (dd < 10 ? '0' + dd : dd) + driver.code + num
            params.INV_NO = seriesNo
            // console.log(params)
            seriesTbl.push(params)
            this.storage.set('ENVNUM_TABLE', seriesTbl)
            // console.log(seriesNo)
            // console.log(seriesTbl)
            resolve(seriesNo)
            // }else{
            //   console.log(this.myInvoiceNumber)
            //   resolve(this.myInvoiceNumber)
            // }
          }
        } else {
          // console.log("3rd");
          params.INV_RUNNING = 1
          seriesTbl = []
          let num = params.INV_RUNNING < 10 ? "0" + params.INV_RUNNING : params.INV_RUNNING
          seriesNo = params.INV_TYPE + "-" + yy + mm + (dd < 10 ? '0' + dd : dd) + driver.code + num
          params.INV_NO = seriesNo
          seriesTbl.push(params)

          this.storage.set('ENVNUM_TABLE', seriesTbl)
          // console.log(seriesNo)
          // console.log(seriesTbl)
          resolve(seriesNo)
        }
      })

    }).catch(err => {
      console.log(err)
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
    await this.presentLoading('Please wait...');

    return new Promise(resolve => {
      Promise.resolve(this.getItems(driverInfo)).then(data => {
        // console.log('ITEMS_TABLE', data);

        Promise.resolve(this.getRates(driverInfo)).then(data => {
          // console.log('RATES_TABLE', data);

          Promise.resolve(this.getRegions(driverInfo)).then(data => {
            // console.log('AREAS_TABLE', data);

            Promise.resolve(this.getInvoicetypes(driverInfo)).then(data => {
              // console.log('INVOICE_TYPES_TABLE', data);

              Promise.resolve(this.getDiscounts(driverInfo)).then(data => {
                // console.log('DISCOUNT_TYPES_TABLE', data);

                Promise.resolve(this.getTimeslot(driverInfo)).then(data => {
                  // console.log('TIMESLOT_TABLE', data);

                  Promise.resolve(this.getFeedback(driverInfo)).then(data => {
                    // console.log('FB_FORM_TABLE', data);

                    this.storage.set('UNSYNCED_PAYMENT_TABLE', '').then(() => {

                      this.storage.set('UNSYNCED_EMAILS_TABLE', '').then(() => {
                        this.loading.dismiss();
                        resolve(true)
                      });
                    });

                  }).catch(e => {
                    console.log(e);
                  });

                }).catch(e => {
                  console.log(e);
                });

              }).catch(e => {
                console.log(e);
              });

            }).catch(e => {
              console.log(e);
            });

          }).catch(e => {
            console.log(e);
          });

        }).catch(e => {
          console.log(e);
        });

      }).catch(e => {
        console.log(e);
      });

    }).catch(err => {
      console.log(err)
    })

  }

  getItems(info: any) {
    if (navigator.onLine == true) {
      let params = {
        email: info.email_address,
        password: info.password
      }
      return new Promise(resolve => {
        this.httpclient.post(this.url + "/items.json", params).subscribe(
          response => {
            let res;
            res = response;
            // console.log(res)

            this.storage.set('ITEMS_TABLE', res).then(() => {
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
    } else {
      return new Promise(resolve => {
        this.storage.get('ITEMS_TABLE').then(res => {
          // console.log(res);
          resolve(res)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }

  getRates(info: any) {
    if (navigator.onLine == true) {
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/rates.json", params).subscribe(
          response => {
            let res;
            res = response;
            // console.log(res)

            this.storage.set('RATES_TABLE', res).then(() => {
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
    } else {
      return new Promise(resolve => {
        this.storage.get('RATES_TABLE').then(res => {
          // console.log(res);
          resolve(res)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }


  getRegions(info: any) {
    if (navigator.onLine == true) {
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/regions.json", params).subscribe(
          response => {
            let res;
            res = response;
            // console.log(res)

            this.storage.set('AREAS_TABLE', res).then(() => {
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
    } else {
      return new Promise(resolve => {
        this.storage.get('AREAS_TABLE').then(res => {
          // console.log(res);
          resolve(res)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }

  getInvoicetypes(info: any) {
    if (navigator.onLine == true) {
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/invoicetypes.json", params).subscribe(
          response => {
            let res;
            res = response;
            // console.log(res)

            this.storage.set('INVOICE_TYPES_TABLE', res).then(() => {
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
    } else {
      return new Promise(resolve => {
        this.storage.get('INVOICE_TYPES_TABLE').then(res => {
          // console.log(res);
          resolve(res)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }

  getDiscounts(info: any) {
    if (navigator.onLine == true) {
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/discounts.json", params).subscribe(
          response => {
            let res;
            res = response;
            // console.log(res)

            this.storage.set('DISCOUNT_TYPES_TABLE', res).then(() => {
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
    } else {
      return new Promise(resolve => {
        this.storage.get('DISCOUNT_TYPES_TABLE').then(res => {
          // console.log(res);
          resolve(res)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }

  getTimeslot(info: any) {
    if (navigator.onLine == true) {
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/timeslots.json", params).subscribe(
          response => {
            let res;
            res = response;
            // console.log(res)

            this.storage.set('TIMESLOT_TABLE', res).then(() => {
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
    } else {
      return new Promise(resolve => {
        this.storage.get('TIMESLOT_TABLE').then(res => {
          // console.log(res);
          resolve(res)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }

  getFeedback(info: any) {
    if (navigator.onLine == true) {
      let params = {
        email: info.email_address,
        password: info.password
      }

      return new Promise(resolve => {
        this.httpclient.post(this.url + "/feedback.json", params).subscribe(
          response => {
            let res;
            res = response;
            // console.log(res)

            this.storage.set('FB_FORM_TABLE', res).then(() => {
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
    } else {
      return new Promise(resolve => {
        this.storage.get('FB_FORM_TABLE').then(res => {
          // console.log(res);
          resolve(res)
        })
      }).catch(err => {
        console.log(err)
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
          // console.log(res)

          // this.storage.set('FB_FORM_TABLE', res).then(() => {
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
          // console.log(res)

          // this.storage.set('FB_FORM_TABLE', res).then(() => {
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
