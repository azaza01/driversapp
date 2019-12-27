import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SyncdeliveryService } from '../api/syncdelivery.service'



@Component({
  selector: 'app-deliverymakepayment',
  templateUrl: './deliverymakepayment.page.html',
  styleUrls: ['./deliverymakepayment.page.scss'],
})
export class DeliverymakepaymentPage implements OnInit {

  loading: any = new LoadingController;

  paymentMethod: any
  payAmount: any = 0
  newamount: any = 0

  datatrue: any

  unsyncData: any

  checkIfRepeat: any

  unsyncDataCollection: any
  newCustomerCredit: any

  invnum: any
  totalamount: any = 0
  billFromCompany: any
  discounts: any
  depositamount: any
  deposittype: any
  balanceAmount: any
  LastPaid: any
  customerCredit: any
  outstandingbalance: any = 0
  finaldeliverydata: any = []

  deliveryStatus: any
  deliveryDetails: any
  isLoading: boolean = false

  email_address: any
  password: any
  name: any
  inn: any

  mySpecialID: any

  todaydate: any

  constructor(
    public alertController: AlertController,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public syncdelivery: SyncdeliveryService,
    private defaultSrvc: DefaultsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getPaymentDetails()
    this.getToday()
    this.getTodayID()
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      // console.log(res)
      this.email_address = res.email_address
      this.password = res.password
      this.name = res.name
    })
  }

  getTodayID() {
    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let hr = new Date().getHours();
    let mn = new Date().getMinutes();
    let sec = new Date().getSeconds();
    let yy = (yyyy + '').substr(2, 2);

    //2019-12-24 17:14:19
    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm
    let hhr = hr < 10 ? "0" + hr : hr
    let mmin = mn < 10 ? "0" + mn : mn
    let sss = sec < 10 ? "0" + sec : sec

    today = yyyy + '-' + mmm + '-' + ddd + " " + hhr + ":" + mmin + ":" + sss;
    // this.mySpecialID = today
    // console.log(today)
    return today
  }


  getPay(payAmount) {
    this.payAmount = payAmount
    if (this.payAmount == undefined) {
      this.payAmount = 0
    }
    // console.log(payAmount)
  }

  getPayemntMethod(paymentMethod) {
    this.paymentMethod = paymentMethod
    console.log(this.paymentMethod)
  }

  getPaymentDetails() {
    this.isLoading = true
    this.storage.get('SELECTED_ITEM').then(res => {
      console.log(res)
      this.isLoading = false
      this.deliveryDetails = res
      this.outstandingbalance = parseInt(this.deliveryDetails.toa) - (parseInt(this.deliveryDetails.dpa) + parseInt(this.deliveryDetails.bap))
      this.inn = res.inn
    })
    // this.invnum = "inn" 
    // this.totalamount = "toa"
    // this.billFromCompany = "coi"
    // this.discounts = "dis"
    // this.depositamount = "dpa"
    // this.deposittype = "dpt"
    // this.LastPaid = "bap"
    // this.outstandingbalance = this.totalamount - (this.depositamount  + this.LastPaid )
    // this.customerCredit = "100"

    // this.invnum = "inn"
    // this.totalamount = 108
    // this.billFromCompany = "CC"
    // this.discounts = 20
    // this.depositamount = 60
    // this.deposittype = "CASH"
    // this.LastPaid = 40
    // this.outstandingbalance = this.totalamount - (this.depositamount + this.LastPaid)
    // this.customerCredit = "100"
  }

  saveSummury() {

    ///SUMMARY_TABLE
    //  SUMMARY_DATE, selectedDate);
    //  SUMMARY_COLLECTED, "0");
    //  SUMMARY_DELIVERED, "0");
    //  SUMMARY_REPEAT, "0");
    //  SUMMARY_TRIP, "0");
    //  SUMMARY_CASHAMOUNT, "0");
    //  SUMMARY_CHEQUEAMOUNT, "0");
    //  SUMMARY_CREDITAMOUNT, "0");
    //  SUMMARY_BANKTRANSFERAMOUNT, "0");
    //  SUMMARY_CCAMOUNT, "0");
    //  SUMMARY_DCAMOUNT, "0");

  }

  saveLocalPayment() {
    ///UNSYNCED_PAYMENT_TABLE

    // UNPAY_DELID,
    // UNPAY_DATE,
    // UNPAY_INVOICENO,
    // UNPAY_INITIAL,
    // UNPAY_TOTAL,
    // UNPAY_DISCOUNT,
    // UNPAY_DEPOAMT,
    // UNPAY_DEPOTYPE,
    // UNPAY_BALANCEPAID,
    // UNPAY_BALANCELEFT

  }

  async makePayment(kindoftransaction) {
    console.log(kindoftransaction)
    this.getdeliveryStatus(kindoftransaction);
    // update summary table SUMMARY_TABLE +1 to deliver add value to (CASH or CREDIT, CHEQUE, BT  +1 to DC/CC)

    //update COLDEL_FLAG KIV 

    //update SUMMARY_TABLE KIV 

    //insert SYNCED_INVOICE_TABLE KIV 

    //if success 

    // send to server del to COLDEL_TABLE 

    // delete also to UNSYNCED_PAYMENT_TABLE

    // else

    // update UNSYNCED_PAYMENT_TABLE 

  }

  // makePaymentAndCreateNew() {
  //   this.getdeliveryStatus();

  //   // update COLDEL_TABLE

  //   // update SUMMARY_TABLE

  //   // UNSYNCED_PAYMENT_TABLE


  // }

  getToday() {
    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let hr = new Date().getHours();
    let min = new Date().getMinutes();
    let ss = new Date().getSeconds();
    let yy = (yyyy + '').substr(2, 2);

    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm
    let hhr = hr < 10 ? "0" + hr : hr
    let mmin = min < 10 ? "0" + min : min
    let sss = ss < 10 ? "0" + ss: ss

    today = yyyy + '-' + mmm + '-' + ddd + " " + hhr + ":" + mmin + ":" + sss;
    this.todaydate = today

    this.mySpecialID = today
    return today
    // console.log(this.todaydate)
  }

  async deliverysync(kindoftransaction) {      
    await Promise.resolve(this.deliveryndata()).then(coldata => {
      if (navigator.onLine == true) {
        if(kindoftransaction == 'repeat'){
          this.checkIfRepeat = "yes";
          this.savePay(coldata);
        }else if(kindoftransaction == 'maypayment'){
        this.checkIfRepeat = "no";
          Promise.resolve(this.syncdelivery.syncdeliverysrvc(coldata)).then(data => {
          if (data == true) {
            this.presentToast("Delivery Successfully Sync")
            this.offlinedeliveryUpdate(coldata);
          } else if (data == "duplicate") {
            this.presentToast("Duplicate Invoice")
            this.savePay(coldata);
          } else {
            this.presentToast("Cannot sync, poor internet connection. Please save later")
            this.savePay(coldata);
          }
        }).catch(e => {
          console.log(e);
          this.presentToast("Error trying to connect on internet connection. Please save later")
          this.savePay(coldata);
        });
       }
      } else {
        if(kindoftransaction == 'repeat'){
          this.savePay(coldata);
          this.checkIfRepeat = "yes";
        }else if(kindoftransaction == 'maypayment'){
          this.presentToast("No internet connection. Please save later")
          this.savePay(coldata);
        }
      }
    })
   
  }

  deliveryndata() {
    return new Promise(resolve => {
      let params = {
        email: this.email_address,
        password: this.password,
        delid: this.deliveryDetails.dei, //pass coldelID (actually is delID) and ws gets the invid
        nowpaid: this.payAmount, // must add the Last Paid field together
        lastpaid: this.deliveryDetails.bap, // should have a field that sends back the previous payment to add up the last deposit with last paid so this current payment can be tracked in settlement
        balancepaid: this.deliveryDetails.dpa, // must add the Last Paid field together because we are updating the balance paid field
        balancetype: this.deliveryDetails.dpt,
        status: this.deliveryStatus,
        ppdate: this.deliveryDetails.ded, //06-05-2013
        pptimeslot: this.deliveryDetails.det, //06-05-2013
        name: this.name,
        savedon: this.todaydate,
        inn: this.inn
      }
      // this.finaldeliverydata.push(params)
      console.log(this.inn)
      resolve(params)
    }).catch(e => {
      console.log(e);
    });
  }


  offlinedeliveryUpdate(offlinedata) {
    this.storage.get('COLDEL_TABLE').then(res => {
      let data, colid, i
      data = res
      let filtered: any = []
      // colid = res.type == 'collection' ? res.findIndex(x => x.id == res.id) : res.findIndex(x => x.dei == res.dei)
      // console.log(colid)
      //i = data.type == 'collection' ? data.findIndex(x => x.id == offlinedata.id) : data.findIndex(x => x.dei == offlinedata.dei)
      if (data != "") {
        data.forEach(coldelData => {
          if (coldelData.coldel_type == 'delivery') {
            if (coldelData.dei == offlinedata.delid) {
              let params = {
                dei: coldelData.dei,
                aid: coldelData.aid,
                cui: coldelData.cui,
                sts: coldelData.sts,
                ded: coldelData.ded,
                ren: coldelData.ren,
                det: coldelData.det,
                cun: coldelData.cun,
                cut: coldelData.cut,
                com: coldelData.com,
                na2: coldelData.na2,
                dea: coldelData.dea,
                deb: coldelData.deb,
                lil: coldelData.lil,
                dun: coldelData.dun,
                cue: coldelData.cue,
                uby: coldelData.uby,
                uon: coldelData.uon,
                dpc: coldelData.dpc,
                cn1: coldelData.cn1,
                cn2: coldelData.cn2,
                cn3: coldelData.cn3,
                noe: coldelData.noe,
                den: coldelData.den,
                han: coldelData.han,
                pac: coldelData.pac,
                rol: coldelData.rol,
                ret: coldelData.ret,
                del: coldelData.del,
                pax: coldelData.pax,
                id: coldelData.id,
                inn: coldelData.inn,
                coi: coldelData.coi,
                toa: coldelData.toa,
                dis: coldelData.dis,
                dpt: coldelData.dpt,
                dpa: coldelData.dpa,
                delivery_driver_id: coldelData.delivery_driver_id,
                delivery_driver: coldelData.delivery_driver,
                cca: coldelData.cca,
                exp: coldelData.exp,
                baa: coldelData.baa,
                bap: coldelData.bap,
                invn: coldelData.invn,
                accu: coldelData.accu,
                coldel_type: coldelData.coldel_type,
                coldel_returndate: coldelData.coldel_returndate,
                coldel_returntime: coldelData.coldel_returntime,
                coldel_flag: "updated"
              }
              filtered.push(params)
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
      if(this.checkIfRepeat == "no"){
        this.router.navigate(['/coldev']);
      }else if(this.checkIfRepeat == "yes"){
        this.repeatInvoice()
      }
    })
  }

  async repeatInvoice() {
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
            // this.defaultSrvc.createInvSeries(tag)
            // this.router.navigate(['/selectcategory', this.collectionInfo]);
            // Promise.resolve(this.defaultSrvc.createInvSeries(tag, this.collectionId)).then(data => {
            //   console.log(data);
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialID
            params.UNINV_COLLID = this.mySpecialID
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = this.deliveryDetails.cui
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = 'Repeat'
            params.UNINV_DEPOAMT = '0'
            params.UNINV_DEPOTYPE = 'Cash'
            params.UNINV_BALANCE = '0'
            params.UNINV_AGREEDDELIVERYDATE = '0000-00-00'
            params.UNINV_DELIVERYTIMESLOT = 'C 11 - 1pm'
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
            console.log(params)

            await this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              console.log(this.unsyncData)

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
            }).finally(() =>  {
              // console.log(this.unsyncData);
              this.checkIfRepeat = "yes";
              // Promise.resolve(this.deliveryndata()).then(coldata => {
              // this.savePay(coldata);
              // })

              let params: any = {}
              params.rid = this.mySpecialID,
              params.coldelID = this.mySpecialID,
              params.custID = this.deliveryDetails.cui,
              params.accID = this.deliveryDetails.com,
              params.credit = this.newCustomerCredit,
              params.invoiceno = "",
              params.invoicetype = "Repeat",
              params.invcompany = tag,

              params.UCOtimestamp = "UCOtimestamp", //new UCO will be generated in the collection loop if necessary
              params.UCOcusttype = this.deliveryDetails.cut, //30-11-2012 for checking minimum
              params.UCOcollecttype = this.deliveryDetails.del,
              params.UCOcollectdate = this.defaultSrvc.getToday(),
              params.UCOcollecttime = this.deliveryDetails.det,
              params.UCOcollectaddress = this.deliveryDetails.dea,
              params.UCOcollectunit = this.deliveryDetails.dun,
              params.UCOcollectpostal = this.deliveryDetails.dpc,
              params.UCOcollectbuilding = this.deliveryDetails.deb,
              params.UCOcollectregion = this.deliveryDetails.ren,
              params.UCOcollectnote = "none",
              params.UCOcollectstatus = "collected",
              params.UCOreturndate = "0000-00-00",
              params.UCOreturntime = "A 10 - 12pm"
              params.done = "A 10 - 12pm"
              params.syncserver = "false"
            
              // this.storage.set('UNSYNCOLLECTIONLOCAL', params).then( datas => {
                this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
                  this.unsyncDataCollection = res
                  // console.log(this.unsyncData)
    
                  if (res == null) {
                    this.unsyncDataCollection = []
                    this.unsyncDataCollection.push(params)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    // console.log(this.unsyncData)
    
                  } else {
                    let result;
                    result = this.unsyncDataCollection.filter((item) => {
                      return (item.rid.indexOf(params.rid) !== -1)
                    })
                    if (result.length < 1) {
                      this.unsyncDataCollection.push(params)
                      this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                      // console.log(this.unsyncData)
    
                    } else {
                      // console.log(result)
                      let i;
                      i = this.unsyncDataCollection.findIndex(x => x.id == result[0].id)
                      this.unsyncDataCollection.splice(i, 1, params);
                      // console.log(this.unsyncData)
                      this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    }
                  }
                }).finally(() => {
                  this.deliveryDetails.dei = this.mySpecialID
                  this.storage.set('SELECTED_ITEM', this.deliveryDetails)
                  this.router.navigate(['/selectcategory', this.deliveryDetails]);
                })
              // })
            })

            // }).catch(e => {
            //   console.log(e);
            // });
          }
        }, {
          text: 'CC',
          handler: async () => {
            tag = "CC"
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialID
            params.UNINV_COLLID = this.mySpecialID
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = this.deliveryDetails.cui
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = 'Repeat'
            params.UNINV_DEPOAMT = '0'
            params.UNINV_DEPOTYPE = 'Cash'
            params.UNINV_BALANCE = '0'
            params.UNINV_AGREEDDELIVERYDATE = '0000-00-00'
            params.UNINV_DELIVERYTIMESLOT = 'C 11 - 1pm'
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
            params.customerCredit = this.newCustomerCredit
            console.log(params)


            await this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
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
              // this.defaultSrvc.getTempItems = null

              this.checkIfRepeat = "yes";

              let params: any = {}
                params.rid = this.mySpecialID,
                params.coldelID = this.mySpecialID,
                params.custID = this.deliveryDetails.cui,
                params.accID = this.deliveryDetails.com,
                params.credit = this.newCustomerCredit,
                params.invoiceno = "",
                params.invoicetype = "Repeat",
                params.invcompany = tag,

                params.UCOtimestamp = this.mySpecialID, //new UCO will be generated in the collection loop if necessary
                params.UCOcusttype = this.deliveryDetails.cut, //30-11-2012 for checking minimum
                params.UCOcollecttype = this.deliveryDetails.del,
                params.UCOcollectdate = this.defaultSrvc.getToday(),
                params.UCOcollecttime = this.deliveryDetails.det,
                params.UCOcollectaddress = this.deliveryDetails.dea,
                params.UCOcollectunit = this.deliveryDetails.dun,
                params.UCOcollectpostal = this.deliveryDetails.dpc,
                params.UCOcollectbuilding = this.deliveryDetails.deb,
                params.UCOcollectregion = this.deliveryDetails.ren,
                params.UCOcollectnote = "",
                params.UCOcollectstatus = "collected",
                params.UCOreturndate = "0000-00-00",
                params.UCOreturntime = "A 10 - 12pm"
                params.syncserver = "false"
              
              // this.storage.set('UNSYNCOLLECTIONLOCAL', params).then(datas => {
                this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
                  this.unsyncDataCollection = res
                  // console.log(this.unsyncData)
    
                  if (res == null) {
                    this.unsyncDataCollection = []
                    this.unsyncDataCollection.push(params)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    // console.log(this.unsyncData)
    
                  } else {
                    let result;
                    result = this.unsyncDataCollection.filter((item) => {
                      return (item.rid.indexOf(params.rid) !== -1)
                    })
                    if (result.length < 1) {
                      this.unsyncDataCollection.push(params)
                      this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                      // console.log(this.unsyncData)
    
                    } else {
                      // console.log(result)
                      let i;
                      i = this.unsyncDataCollection.findIndex(x => x.id == result[0].id)
                      this.unsyncDataCollection.splice(i, 1, params);
                      // console.log(this.unsyncData)
                      this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    }
                  }
                }).finally(() =>{
                  this.deliveryDetails.dei = this.mySpecialID
                  this.storage.set('SELECTED_ITEM', this.deliveryDetails)
                  this.router.navigate(['/selectcategory', this.deliveryDetails]);
                })
              // })
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


  async savePay(offlinedata) {
    console.log(offlinedata)
    // await this.presentLoading('Syncing local Data');
    let params = {
      email: offlinedata.email,
      password: offlinedata.password,
      delid: offlinedata.delid, //pass coldelID (actually is delID) and ws gets the invid
      nowpaid: offlinedata.nowpaid, // must add the Last Paid field together
      lastpaid: offlinedata.lastpaid, // should have a field that sends back the previous payment to add up the last deposit with last paid so this current payment can be tracked in settlement
      balancepaid: offlinedata.balancepaid,  // must add the Last Paid field together because we are updating the balance paid field
      balancetype: offlinedata.balancetype,
      status: offlinedata.status,
      ppdate: offlinedata.ppdate, //06-05-2013
      pptimeslot: offlinedata.pptimeslot, //06-05-2013
      name: offlinedata.name,
      savedon: offlinedata.savedon,
      inn: this.inn
    }
    console.log(this.inn)
    this.finaldeliverydata.push(params)
    // await this.presentLoading('Syncing local Data');
    ////update UNSYNCED_INVOICE_TABLE
    await this.storage.get('UNSYNCED_PAYMENT_TABLE').then(res => {
      let data
      data = res
      let filtered: any = []
      console.log(data)

      if (data == null) {
        this.storage.set('UNSYNCED_PAYMENT_TABLE', this.finaldeliverydata)
      } else {
        data.forEach(unsync => {
          if (unsync.dei == offlinedata.delid) {
            filtered.push(this.finaldeliverydata)
          } else {
            filtered.push(unsync)
          }
        });
        this.storage.set('UNSYNCED_PAYMENT_TABLE', filtered)
        // this.loading.dismiss();
      }

    }).finally(() => {
      this.storage.get('UNSYNCED_PAYMENT_TABLE').then(ress => {
        console.log(ress)
      })
    })

    this.offlinedeliveryUpdate(offlinedata);
  }


  async getdeliveryStatus(kindoftransaction) {
    const alert = await this.alertController.create({
      header: 'Delivery Status',
      message: "Please choose below for current selected delivery to proceed",
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'Full Delivered',
          handler: () => {
            this.deliveryStatus = "Full Delivered"
            this.getDeliveryPaymentStatus(kindoftransaction);
          }
        }, {
          text: 'Partial Delivered',
          handler: () => {
            this.deliveryStatus = "Partial Delivered"
            this.getDeliveryPaymentStatus(kindoftransaction);
          }
        }
      ]
    });

    await alert.present();
  }

  getDeliveryPaymentStatus(kindoftransaction) {
    console.log(this.deliveryDetails.bap);
    console.log(this.deliveryDetails.dpa);
    console.log(this.payAmount);
    this.newamount = parseFloat(this.deliveryDetails.bap + this.deliveryDetails.dpa) + (this.payAmount);
    console.log(this.newamount);
    if (this.newamount >= this.outstandingbalance) {
      //Log.d("spark", "paid amount is smaller than existing credits");
      //status = status + ", Full Paid";
      //if credit amount is less than the amount to pay, mark as partial paid
      if ((this.deliveryDetails.cca < this.outstandingbalance) && (this.paymentMethod == "CREDIT")) { //outstandingPaid is > than creditsBalance 2015-01-13
        this.deliveryStatus = this.deliveryStatus + ", Partial Paid"
          this.deliverysync(kindoftransaction);
      } else {
        this.deliveryStatus = this.deliveryStatus + ", Full Paid";
        this.newCustomerCredit = this.deliveryDetails.cca - this.outstandingbalance
          this.deliverysync(kindoftransaction);
      }
    } else if (this.outstandingbalance == 0) {
      this.deliveryStatus = this.deliveryStatus + ", Unpaid";   
        this.deliverysync(kindoftransaction);
    } else {
      this.deliveryStatus = this.deliveryStatus + ", Partial Paid";
        this.deliverysync(kindoftransaction);
    }

  }

  createInvoiceItem() {

  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  async presentToast(msg) {

    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: 'medium',
      cssClass: 'customToast-class',
    });
    toast.present();
  }

}
