import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { Storage } from '@ionic/storage';
import { async } from '@angular/core/testing';
import { CallNumber } from '@ionic-native/call-number/ngx';
// import { SMS } from '@ionic-native/sms/ngx';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';
// import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-colectionview',
  templateUrl: './colectionview.page.html',
  styleUrls: ['./colectionview.page.scss'],
})
export class ColectionviewPage implements OnInit {


  collectionInfo: any = []
  driverInfo: any
  isLoading: boolean = false
  unsyncData: any;
  timeslots: any = []
  selectedtime: any
  callnumber: any
  sendNumber: any
  customerName: any;

  customerEmail: any;
  customerId: any
  today: any;
  originalDate: any
  collectionId: any
  formatedDate: any
  reasonofpostpone: any = "";
  currentInstruction: any

  mySpecialID: any

  postponeDate: any

  isTodayCollection: any


  loading: any = new LoadingController;
  require: any


  constructor(
    private router: Router,
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute,
    private defaultSrvc: DefaultsService,
    private storage: Storage,
    private accSrvc: AccountsService,
    private cltnSrvc: CollectionService,
    private callNumber: CallNumber,
    public loadingCtrl: LoadingController,
    // private geolocation: Geolocation

    // private sms: SMS
  ) { }

  ngOnInit() {
    this.isLoading = true
    this.activatedRoute.params.subscribe((params) => {
      ////console.log(params);
      this.collectionInfo = params
      this.selectedtime = this.collectionInfo.cot
      this.customerName = this.collectionInfo.cun
      this.customerEmail = this.collectionInfo.cue
      this.customerId = this.collectionInfo.cui
      this.originalDate = this.collectionInfo.cod
      this.collectionId = this.collectionInfo.id

      this.currentInstruction =  this.collectionInfo.con
      ////console.log(this.currentInstruction)

      this.isTodayCollection = this.defaultSrvc.getToday();

      let todays;
      let dd = new Date(this.originalDate).getDate();
      let mm = new Date(this.originalDate).getMonth() + 1;
      let yyyy = new Date(this.originalDate).getFullYear();
      //todays = dd + "-" + mm + "-" + yyyy
      let ddd = dd < 10 ? "0" + dd : dd
      let mmm = mm < 10 ? "0" + mm : mm
      todays = yyyy + "-" + mmm + "-" + ddd
      this.today = this.collectionInfo.cod
      // ////console.log(todays)
      this.getTodayID();
    });

    this.storage.get('ACCOUNTS_TABLE').then(res => {
      this.driverInfo = res
      // ////console.log(this.driverInfo)
      this.isLoading = false
    })

    this.storage.get('TIMESLOT_TABLE').then(res => {
      res.forEach(element => {
        this.timeslots.push(element.description)
      });
      // ////console.log(this.timeslots)
      this.isLoading = false
    })

    // this.storage.get("TIMESLOT_TABLE").then(res => {
    //   var flags = [], output = [], l = res.length, i;
    //   for (i = 0; i < l; i++) {
    //     if (flags[res[i].description]) continue;
    //     flags[res[i].description] = true;
    //     output.push(res[i].description);

    //   }
    //   this.timeslots = output;
    // })

  }

  // getMylocation(){
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     // resp.coords.latitude
  //     // resp.coords.longitude
  //     this.presentAlert(resp.coords.latitude)
  //    }).catch((error) => {
  //      ////console.log('Error getting location', error);
  //    });
     
  //    let watch = this.geolocation.watchPosition();
  //    watch.subscribe((data) => {
  //     // data can be a set of coordinates, or an error (if an error occurred).
  //     // data.coords.latitude
  //     // data.coords.longitude
  //     this.presentAlert(data.coords.latitude)
  //    });
  // }

  // sendMessage(number){
  //   if(number == "1"){
  //     this.sendNumber = this.collectionInfo.cn1
  //   }else{
  //     this.sendNumber = this.collectionInfo.cn2
  //   }
  //   this.sms.send(this.sendNumber, 'Dear');
  // }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      message: msg,
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  getTodayID() {
    let today;
    let todayId
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let hr = new Date().getHours();
    let mn = new Date().getMinutes();
    let sec = new Date().getSeconds();
    let yy = (yyyy + '').substr(2, 2);
    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm
    let hhr = hr < 10 ? "0" + hr : hr
    let mmin = mn < 10 ? "0" + mn : mn
    let sss = sec < 10 ? "0" + sec : sec


    //2019-12-24 17:14:19
    today = yyyy + '-' + mmm + '-' + ddd;
    todayId = yyyy + '-' + mmm + '-' + ddd + " " + hhr + ":" + mmin + ":" + sss ;
    this.mySpecialID = todayId
    this.postponeDate = ddd + '-' + mmm + '-' + yyyy
    ////console.log(today)
    return today
  }



  callNow(number) {
    if (number == "1") {
      this.callnumber = this.collectionInfo.cn1
    } else {
      this.callnumber = this.collectionInfo.cn2
    }
    this.callNumber.callNumber(this.callnumber, true)
      .then(res =>console.log('Launched dialer!', res))
      .catch(err =>console.log('Error launching dialer', err));
  }

  async postphone() {
    // ////console.log(this.today)
    // ////console.log(this.selectedtime)
    let selectedDate;
    let dd = new Date(this.today).getDate();
    let mm = new Date(this.today).getMonth() + 1;
    let yyyy = new Date(this.today).getFullYear();
    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm
    // let hhr = hr < 10 ? "0" + hr : hr
    // let mmin = mn < 10 ? "0" + mn : mn
    // let sss = sec < 10 ? "0" + sec : sec
    
    selectedDate = yyyy + "-" + mmm + "-" + ddd
    let selectedDate2;
    let dddd = new Date(this.today).getDate();
    let mmmm = new Date(this.today).getMonth() + 1;
    let yyyyy = new Date(this.today).getFullYear();
    let myday = dd < 10 ? "0" + dddd : dddd
    let mymonth = mm < 10 ? "0" + mmmm : mmmm
    selectedDate2 = myday + "-" + mymonth + "-" + yyyyy

    // ////console.log(this.reasonofpostpone)

    ////console.log(selectedDate)
    ////console.log(this.originalDate)

    if (selectedDate == this.originalDate) {
      this.presentAlert("Selected Date is the same as today. Please choose other day to Re-Schedule");
    } else {
      if (this.reasonofpostpone != "") {
        await this.presentLoading('');
        await Promise.resolve(this.cltnSrvc.postPone(this.driverInfo, this.today, this.selectedtime, this.collectionId, this.reasonofpostpone, this.currentInstruction, this.postponeDate)).then(data => {
          if (data != "false" || data != "") {
            this.removepostpone(this.collectionId)
            this.presentAlert("Collection Re-scheduled to " + selectedDate2 + " with timing " + this.selectedtime);
            this.loading.dismiss();
            //need to check
          } else {
            this.presentAlert("Connection error");
            this.loading.dismiss();
          }
        }).catch(e => {
          ////console.log(e);
          this.presentAlert("Connection error");
          this.loading.dismiss();
        });
      } else {
        this.presentAlert("Please add reason of Re-schedule");
      }
    }
  }

  removepostpone(collectionid){
      this.storage.get('COLDEL_TABLE').then(res => {
        let data, colid, i
        data = res
        let filtered: any = []
        // colid = res.type == 'collection' ? res.findIndex(x => x.id == res.id) : res.findIndex(x => x.dei == res.dei)
        // ////console.log(colid)
        //i = data.type == 'collection' ? data.findIndex(x => x.id == offlinedata.id) : data.findIndex(x => x.dei == offlinedata.dei)
        if (data != "") {
          data.forEach(coldelData => {
            if (coldelData.coldel_type == 'collection') {
              if (coldelData.id == collectionid) {
                
              } else {
                filtered.push(coldelData)
              }
            } else {
              filtered.push(coldelData)
            }
          });
          
          this.storage.set('COLDEL_TABLE', filtered)
        }
      }).finally(() => {
          this.router.navigate(['/coldev']);
      })
  }


  async updateMyEmail() {
    // var validator = require("email-validator"); //need to check
    this.presentLoading('Syncing Email Data');
    // if(validator.validate(this.customerEmail) == true){
    let params = {
      customerID: this.customerId,
      customerEmail: this.customerEmail
    }

    await Promise.resolve(this.cltnSrvc.updateEmail(this.driverInfo, this.customerEmail, this.customerId)).then(data => {

      if (data != "false") {
        this.presentAlert("Email Successfully Change");
        this.loading.dismiss();
      } else {
        this.presentAlert("Connection error");

        this.storage.get('UNSYNCED_EMAILS_TABLE').then(res => {
          let data
          data = res
          let filtered: any = []
          if (data != "") {
            data.forEach(unsync => {
              if (unsync.customerID == this.customerId) {
                filtered.push(params)
              } else {
                filtered.push(unsync)
              }
            });
            this.storage.set('UNSYNCED_EMAILS_TABLE', filtered)
            this.loading.dismiss();
          }else{
            this.storage.set('UNSYNCED_EMAILS_TABLE', params)
            this.loading.dismiss();
          }
        }).finally(() => {
          this.storage.get('UNSYNCED_EMAILS_TABLE').then(res => {
            // ////console.log(res)
            this.loading.dismiss();
          })
          
        })
      }
    }).catch(e => {
      ////console.log(e);
      this.storage.get('UNSYNCED_EMAILS_TABLE').then(res => {
        let data
        data = res
        let filtered: any = []
        if (data != "") {
          data.forEach(unsync => {
            if (unsync.customerID == this.customerId) {
              filtered.push(params)
            } else {
              filtered.push(unsync)
            }
          });
          this.storage.set('UNSYNCED_EMAILS_TABLE', filtered)
          this.loading.dismiss();
        }else{
          this.storage.set('UNSYNCED_EMAILS_TABLE', params)
          this.loading.dismiss();
        }
      }).finally(() => {
        this.storage.get('UNSYNCED_EMAILS_TABLE').then(res => {
          // ////console.log(res)
          this.loading.dismiss();
        })
      })
      this.loading.dismiss();
    });
    this.loading.dismiss();
    // }else{
    //   this.presentAlert("Invalid Email! Please check.");
    //   this.loading.dismiss();
    // }
  }



  getTime(selectedtime) {
    ////console.log(selectedtime);
  }

  async createInvoiceSelectItem(info: any = []) {
    ////console.log(info)
    // ////console.log(this.collectionInfo)
    let tag;
    const alert = await this.alertController.create({
      header: 'Bill from which company?',
      message: 'For curtains, carpets and sofa covers, please bill from DC. For any others, please bill from CC.',
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'DC',
          handler: async () => {
            //function herer
            // ////console.log(this.selected);
            tag = "DC"
            // info.tag = "DC"
            // this.defaultSrvc.createInvSeries(tag)
            // this.router.navigate(['/selectcategory', this.collectionInfo]);
            // Promise.resolve(this.defaultSrvc.createInvSeries(tag, this.collectionId)).then(data => {
            //   ////console.log(data);
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialID
            params.UNINV_COLLID = info.id
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = info.cui
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = "New"
            params.UNINV_DEPOAMT = '0'
            params.UNINV_DEPOTYPE = 'Cash'
            params.UNINV_BALANCE = '0'
            params.UNINV_AGREEDDELIVERYDATE = info.rtd
            params.UNINV_DELIVERYTIMESLOT = info.cot
            params.UNINV_INVOICENOTE = ''
            params.UNINV_DISCOUNT = '0'
            params.UNINV_EXPRESS = '1.00'
            params.UNINV_HASDONATE = '0'
            params.UNINV_DONATE = '0'
            params.UNINV_BAGS = '0'
            params.drvna = '0'
            params.drvpa = '0'
            params.drvem = '0'
            params.colitem = '0'
            params.UNINV_SAVEDON = this.today
            params.syncserver = "false"
            params.driversId = this.driverInfo.id
            params.invoicesynctype = "New"
           //console.log(params)

            this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              // ////console.log(this.unsyncData)

              if (res == null) {
                this.unsyncData = []
                this.unsyncData.push(params)
                this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                // ////console.log(this.unsyncData)

              } else {
                let result;
                result = this.unsyncData.filter((item) => {
                  return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                })
                if (result.length < 1) {
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // ////console.log(this.unsyncData)

                } else {
                  // ////console.log(result)
                  let i;
                  i = this.unsyncData.findIndex(x => x.id == result[0].id)
                  this.unsyncData.splice(i, 1, params);
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // ////console.log(this.unsyncData)
                }
              }
            }).finally(() => {
              // ////console.log(this.unsyncData);
              this.router.navigate(['/selectcategory', info]);
            })

            // }).catch(e => {
            //   ////console.log(e);
            // });
          }
        }, {
          text: 'CC',
          handler: async () => {
            //function herer
            // ////console.log(this.selected);
            tag = "CC"
            // info.tag(tag)
            // this.collectionInfo. = ""
            // this.defaultSrvc.createInvSeries(tag)
            // Promise.resolve(this.defaultSrvc.createInvSeries(tag,this.collectionId)).then(data => {
            //   ////console.log(data);
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialID
            params.UNINV_COLLID = info.id
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = info.cui
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = "New"
            params.UNINV_DEPOAMT = '0'
            params.UNINV_DEPOTYPE = 'Cash'
            params.UNINV_BALANCE = '0'
            params.UNINV_AGREEDDELIVERYDATE = info.rtd
            params.UNINV_DELIVERYTIMESLOT = info.cot
            params.UNINV_INVOICENOTE = ''
            params.UNINV_DISCOUNT = '0'
            params.UNINV_EXPRESS = '1.00'
            params.UNINV_HASDONATE = '0'
            params.UNINV_DONATE = '0'
            params.UNINV_BAGS = '0'
            params.drvna = '0'
            params.drvpa = '0'
            params.drvem = '0'
            params.colitem = '0'
            params.UNINV_SAVEDON = this.today
            params.syncserver = "false"
            params.driversId = this.driverInfo.id
            params.invoicesynctype = "New"
           //console.log(params)

            this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              // ////console.log(this.unsyncData)

              if (res == null) {
                this.unsyncData = []
                this.unsyncData.push(params)
                this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                // ////console.log(this.unsyncData)

              } else {
                let result;
                result = this.unsyncData.filter((item) => {
                  return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                })
                if (result.length < 1) {
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // ////console.log(this.unsyncData)

                } else {
                  // ////console.log(result)
                  let i;
                  i = this.unsyncData.findIndex(x => x.id == result[0].id)
                  this.unsyncData.splice(i, 1, params);
                  // ////console.log(this.unsyncData)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                }
              }
            }).finally(() => {
              // ////console.log(this.unsyncData);
              this.defaultSrvc.getTempItems = null
              this.router.navigate(['/selectcategory', info]);
            })

            // }).catch(e => {
            //   ////console.log(e);
            // });
          }
        }
      ],
    });

    await alert.present();
  }


}
