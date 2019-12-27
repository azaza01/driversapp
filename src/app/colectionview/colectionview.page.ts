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

  mySpecialID: any


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
      console.log(params);
      this.collectionInfo = params
      this.selectedtime = this.collectionInfo.cot
      this.customerName = this.collectionInfo.cun
      this.customerEmail = this.collectionInfo.cue
      this.customerId = this.collectionInfo.cui
      this.originalDate = this.collectionInfo.cod
      this.collectionId = this.collectionInfo.id

      let todays;
      let dd = new Date(this.originalDate).getDate();
      let mm = new Date(this.originalDate).getMonth() + 1;
      let yyyy = new Date(this.originalDate).getFullYear();
      //todays = dd + "-" + mm + "-" + yyyy
      todays = yyyy + "-" + mm + "-" + dd
      this.today = this.collectionInfo.cod
      // console.log(todays)
      this.getTodayID();
    });

    this.storage.get('ACCOUNTS_TABLE').then(res => {
      this.driverInfo = res
      // console.log(this.driverInfo)
      this.isLoading = false
    })

    this.storage.get('TIMESLOT_TABLE').then(res => {
      res.forEach(element => {
        this.timeslots.push(element.description)
      });
      // console.log(this.timeslots)
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
  //      console.log('Error getting location', error);
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

    //2019-12-24 17:14:19
    today = yyyy + '-' + mm + '-' + dd;
    todayId = yyyy + '-' + mm + '-' + dd + " " + hr + ":" + mn + ":" + sec ;
    this.mySpecialID = todayId
    console.log(today)
    return today
  }



  callNow(number) {
    if (number == "1") {
      this.callnumber = this.collectionInfo.cn1
    } else {
      this.callnumber = this.collectionInfo.cn2
    }
    this.callNumber.callNumber(this.callnumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async postphone() {
    // console.log(this.today)
    // console.log(this.selectedtime)
    let selectedDate;
    let dd = new Date(this.today).getDate();
    let mm = new Date(this.today).getMonth() + 1;
    let yyyy = new Date(this.today).getFullYear();
    selectedDate = yyyy + "-" + mm + "-" + dd
    let selectedDate2;
    let ddd = new Date(this.today).getDate();
    let mmm = new Date(this.today).getMonth() + 1;
    let yyyyy = new Date(this.today).getFullYear();
    selectedDate2 = ddd + "-" + mmm + "-" + yyyyy

    // console.log(this.reasonofpostpone)

    if (selectedDate == this.originalDate) {
      this.presentAlert("Selected Date is the same as today. Please choose other day to postpone");
    } else {
      if (this.reasonofpostpone != "") {
        await this.presentLoading('');
        await Promise.resolve(this.cltnSrvc.postPone(this.accSrvc.accountsDetails(), this.today, this.selectedtime, this.collectionId, this.reasonofpostpone)).then(data => {
          if (data == true) {
            this.presentAlert("Collection Postponed to " + selectedDate2 + " with timing " + this.selectedtime);
            this.loading.dismiss();
            //need to check
          } else {
            this.presentAlert("Connection error");
            this.loading.dismiss();
          }
        }).catch(e => {
          console.log(e);
          this.presentAlert("Connection error");
          this.loading.dismiss();
        });
      } else {
        this.presentAlert("Please add reason of Re-schedule");
      }
    }
  }


  async updateMyEmail() {
    // var validator = require("email-validator"); //need to check
    this.presentLoading('Syncing local Data');
    // if(validator.validate(this.customerEmail) == true){
    let params = {
      customerID: this.customerId,
      customerEmail: this.customerEmail
    }

    await Promise.resolve(this.cltnSrvc.updateEmail(this.accSrvc.accountsDetails(), this.customerEmail, this.customerId)).then(data => {

      if (data == true) {
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
            // console.log(res)
            this.loading.dismiss();
          })
          
        })
      }
    }).catch(e => {
      console.log(e);
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
          // console.log(res)
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
    console.log(selectedtime);
  }

  async createInvoiceSelectItem(info: any = []) {
    console.log(info)
    // console.log(this.collectionInfo)
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
            // console.log(this.selected);
            tag = "DC"
            // info.tag = "DC"
            // this.defaultSrvc.createInvSeries(tag)
            // this.router.navigate(['/selectcategory', this.collectionInfo]);
            // Promise.resolve(this.defaultSrvc.createInvSeries(tag, this.collectionId)).then(data => {
            //   console.log(data);
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialID
            params.UNINV_COLLID = info.id
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = info.cui
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = 'New'
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
            params.UNINV_SAVEDON = this.mySpecialID
            params.syncserver = "false"
            // console.log(params)

            this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              // console.log(this.unsyncData)

              if (res == null) {
                this.unsyncData = []
                this.unsyncData.push(params)
                this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                // console.log(this.unsyncData)

              } else {
                let result;
                result = this.unsyncData.filter((item) => {
                  return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                })
                if (result.length < 1) {
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // console.log(this.unsyncData)

                } else {
                  // console.log(result)
                  let i;
                  i = this.unsyncData.findIndex(x => x.id == result[0].id)
                  this.unsyncData.splice(i, 1, params);
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // console.log(this.unsyncData)
                }
              }
            }).finally(() => {
              // console.log(this.unsyncData);
              this.router.navigate(['/selectcategory', info]);
            })

            // }).catch(e => {
            //   console.log(e);
            // });
          }
        }, {
          text: 'CC',
          handler: async () => {
            //function herer
            // console.log(this.selected);
            tag = "CC"
            // info.tag(tag)
            // this.collectionInfo. = ""
            // this.defaultSrvc.createInvSeries(tag)
            // Promise.resolve(this.defaultSrvc.createInvSeries(tag,this.collectionId)).then(data => {
            //   console.log(data);
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialID
            params.UNINV_COLLID = info.id
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = info.cui
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = 'New'
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
            params.UNINV_SAVEDON = this.mySpecialID
            params.syncserver = "false"
            // console.log(params)

            this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              // console.log(this.unsyncData)

              if (res == null) {
                this.unsyncData = []
                this.unsyncData.push(params)
                this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                // console.log(this.unsyncData)

              } else {
                let result;
                result = this.unsyncData.filter((item) => {
                  return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                })
                if (result.length < 1) {
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // console.log(this.unsyncData)

                } else {
                  // console.log(result)
                  let i;
                  i = this.unsyncData.findIndex(x => x.id == result[0].id)
                  this.unsyncData.splice(i, 1, params);
                  // console.log(this.unsyncData)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                }
              }
            }).finally(() => {
              // console.log(this.unsyncData);
              this.defaultSrvc.getTempItems = null
              this.router.navigate(['/selectcategory', info]);
            })

            // }).catch(e => {
            //   console.log(e);
            // });
          }
        }
      ],
    });

    await alert.present();
  }


}
