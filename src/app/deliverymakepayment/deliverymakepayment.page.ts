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

  paymentMethod: any = "Cash"
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
  outstandingbalance: number = 0
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


  initial: any
  mydate: any

  driversDetails: any

  constructor(
    public alertController: AlertController,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public syncdelivery: SyncdeliveryService,
    private defaultSrvc: DefaultsService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.getPaymentDetails()
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      // //////console.log(res)
      this.driversDetails = res
      this.email_address = res.email_address
      this.password = res.password
      this.name = res.name
    }).finally(() =>{
      // this.loading.dismiss();
    })
    this.getToday()
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
    this.mySpecialID = today
    // //////console.log(today)
    return today
  }


  getPay(payAmount) {
    this.payAmount = payAmount
    if (this.payAmount == undefined) {
      this.payAmount = 0
    }
    // //////console.log(payAmount)
  }

  getPayemntMethod(paymentMethod) {
    this.paymentMethod = paymentMethod
    //////console.log(this.paymentMethod)
  }

  getPaymentDetails() {
    this.isLoading = true
    this.storage.get('SELECTED_ITEM').then(res => {
      //////console.log(res)
      this.isLoading = false
      this.deliveryDetails = res
      this.outstandingbalance = this.deliveryDetails.baa
      //parseInt(this.deliveryDetails.toa) - (parseInt(this.deliveryDetails.dpa) + parseInt(this.deliveryDetails.bap))
      this.inn = res.inn
      this.initial = res.coi
    }).then(() =>{
      this.getToday()
    }).finally(() => {
      this.getTodayID()
    })
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
    //////console.log(kindoftransaction)
    this.checkIfRepeat = kindoftransaction;
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
    this.mydate =  yyyy + '-' + mmm + '-' + ddd 
    this.todaydate = today

    this.mySpecialID = today
    return today
    // //////console.log(this.todaydate)
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
    //////console.log(this.deliveryDetails.bap);
    //////console.log(this.deliveryDetails.dpa);
    ////////console.log(this.payAmount);

    this.newamount = ((this.deliveryDetails.bap * 1) + (this.deliveryDetails.dpa * 1) * 1) + ((this.payAmount) * 1);
    //////console.log(this.newamount);
    var checkunpaid = this.deliveryDetails.toa - this.newamount
    //////console.log(checkunpaid);

    //////console.log(this.paymentMethod);
    if(this.paymentMethod == "Credit"){
      if(checkunpaid <= 0){
        this.deliveryStatus = this.deliveryStatus + ", Full Paid";
        this.newCustomerCredit = this.deliveryDetails.cca - this.outstandingbalance
        this.deliverysync(kindoftransaction);
      }else{
        this.presentToast("Credit amount is less than outstanding balance")
        this.deliveryStatus = this.deliveryStatus + ", Full Paid"
        this.deliverysync(kindoftransaction);
      }
    }else{
      if (checkunpaid <= 0) {
        this.deliveryStatus = this.deliveryStatus + ", Full Paid";
        this.deliverysync(kindoftransaction);
      }else if(checkunpaid > 0 && checkunpaid < this.deliveryDetails.toa){
        this.deliveryStatus = this.deliveryStatus + ", Partial Paid";
        this.deliverysync(kindoftransaction);
      }else if(this.newamount == 0) {
        this.deliveryStatus = this.deliveryStatus + ", Unpaid";
        this.deliverysync(kindoftransaction);
      }
    }
  }


  async deliverysync(kindoftransaction) {   
    //////console.log(this.deliveryStatus )
     
      await this.presentLoading('Syncing Payments');     
      await Promise.resolve(this.deliveryndata()).then(coldata => {

        //////console.log(coldata)

        if (navigator.onLine == true) {
          if(kindoftransaction == 'repeat'){
            this.presentToast("Current Transaction will save locally")
            //////console.log("2")
            this.savePay(coldata);
          }else if(kindoftransaction == 'maypayment'){
            Promise.resolve(this.syncdelivery.syncdeliverysrvc(coldata)).then(data => {
            if (data == true) {
              this.presentToast("Delivery Successfully Sync")
              this.offlinedeliveryUpdate(coldata);
            } else if (data == "duplicate") {
              this.presentToast("Duplicate Invoice")
              this.savePay(coldata);
            } else {
              this.presentToast("Cannot sync, poor internet connection. Please save later, Payment saved locally")
              this.savePay(coldata);
            }
          }).catch(e => {
            //////console.log(e);
            this.presentToast("Cannot sync, poor internet connection. Please save later, Payment saved locally")
            this.savePay(coldata);
          });
         }
        } else {
          if(kindoftransaction == 'repeat'){
            //////console.log("1")
            this.presentToast("Cannot sync, poor internet connection. Please save later, Payment saved locally")
            this.savePay(coldata);
          }else if(kindoftransaction == 'maypayment'){
            this.presentToast("Cannot sync, poor internet connection. Please save later, Payment saved locally")
            this.savePay(coldata);
          }
        }

      })
  }

  deliveryndata() {
    if(this.payAmount == null || this.payAmount == 0){
      this.payAmount = "0.00"
    }
    return new Promise(resolve => {
      let params = {
        email: this.email_address,
        password: this.password,
        delid: this.deliveryDetails.dei, //pass coldelID (actually is delID) and ws gets the invid
        nowpaid: this.payAmount, // must add the Last Paid field together
        lastpaid: this.deliveryDetails.bap, // should have a field that sends back the previous payment to add up the last deposit with last paid so this current payment can be tracked in settlement
        balancepaid: this.payAmount, // must add the Last Paid field together because we are updating the balance paid field
        balancetype: this.deliveryDetails.dpt,
        status: this.deliveryStatus,
        ppdate: this.deliveryDetails.ded, //06-05-2013
        pptimeslot: this.deliveryDetails.det, //06-05-2013
        name: this.name,
        savedon: this.todaydate,
        inn: this.inn
      }
      // this.finaldeliverydata.push(params)
      //////console.log(this.inn)
      resolve(params)
    }).catch(e => {
      //////console.log(e);
    });
  }


  offlinedeliveryUpdate(offlinedata) {
    this.storage.get('COLDEL_TABLE').then(res => {
      let data, colid, i
      data = res
      let filtered: any = []
      // colid = res.type == 'collection' ? res.findIndex(x => x.id == res.id) : res.findIndex(x => x.dei == res.dei)
      // //////console.log(colid)
      //i = data.type == 'collection' ? data.findIndex(x => x.id == offlinedata.id) : data.findIndex(x => x.dei == offlinedata.dei)
      if (data != "") {
        data.forEach(coldelData => {
          if (coldelData.coldel_type == 'delivery') {
            if (coldelData.dei == offlinedata.delid) {
             //delete
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
      this.proceedtoWhere(this.checkIfRepeat, offlinedata)
    })
  }

  proceedtoWhere(kindoftransaction, offlinedata){

    let params: any = {}
    params.invoicecompany = this.initial
    params.invoicetype = "Delivery"
    params.amount = offlinedata.nowpaid
    params.paidtype = offlinedata.balancetype
    params.noofcol = 0
    params.nofodel = 1
    params.driversid = this.driversDetails.id
    params.date = this.mydate
    params.invoiceno = this.inn 

    this.storage.get('DRIVER_SUMMARY').then(res => {
      this.unsyncData = res
      // ////console.log(this.unsyncData)

      if (res == null) {
        this.unsyncData = []
        this.unsyncData.push(params)
        this.storage.set('DRIVER_SUMMARY', this.unsyncData)
        // ////console.log(this.unsyncData)

      } else {
        let result;
        result = this.unsyncData.filter((item) => {
          return (item.invoiceno.indexOf(offlinedata.inn) !== -1)
        })
        if (result.length < 1) {
          this.unsyncData.push(params)
          this.storage.set('DRIVER_SUMMARY', this.unsyncData)
          // ////console.log(this.unsyncData)

        } else {
          // ////console.log(result)
          let i;
          i = this.unsyncData.findIndex(x => x.id == result[0].id)
          this.unsyncData.splice(i, 1, params);
          this.storage.set('DRIVER_SUMMARY', this.unsyncData)
          // ////console.log(this.unsyncData)
        }
      }
    })

    if(kindoftransaction == "maypayment"){
      this.loading.dismiss();
      this.router.navigate(['/coldev']);
      // this.removeCurrentTransaction(offlinedata)
    }else if(kindoftransaction == "repeat"){
      this.loading.dismiss();
      this.repeatInvoice()
    }
  }

  removeCurrentTransaction(offlinedata){
    this.storage.get('UNSYNCED_PAYMENT_TABLE').then(res => {
      let data
      data = res
      let filtered: any = []
      if (data != "") {
        data.forEach(coldelData => {
            if (coldelData.delid  == offlinedata.delid ) {
             //delete data
            } else {
              filtered.push(coldelData)
            }
        });
        
        this.storage.set('UNSYNCED_PAYMENT_TABLE', filtered)
      }
    }).finally(() => {
      this.storage.get('UNSYNCED_PAYMENT_TABLE').then(res => {
        //////console.log(res)
        this.loading.dismiss();
        this.router.navigate(['/coldev']);
      })
    })
  }

 

  async repeatInvoice() {
    let tag;
    const alert = await this.alertController.create({
      header: 'Bill from which company?',
      message: 'For curtains, carpets and sofa covers, please bill from DC. For any others, please bill from CC.',
      cssClass: 'ion-alertCSS',
      backdropDismiss:false,
      buttons: [
        {
          text: 'DC',
          handler: async () => {
            //function herer
            // //////console.log(this.selected);
            tag = "DC"
            // this.defaultSrvc.createInvSeries(tag)
            // this.router.navigate(['/selectcategory', this.collectionInfo]);
            // Promise.resolve(this.defaultSrvc.createInvSeries(tag, this.collectionId)).then(data => {
            //   //////console.log(data);
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
            params.UNINV_DELIVERYTIMESLOT = 'A 10 - 12pm'
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
            params.UNINV_SAVEDON = this.todaydate
            params.syncserver = "false"
            // params.customerCredit = this.newCustomerCredit
            params.driversId = this.driversDetails.id
            params.invoicesynctype = 'Repeat'
            //////console.log(params)

            await this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              //////console.log(this.unsyncData)

              if (res == null) {
                this.unsyncData = []
                this.unsyncData.push(params)
                this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                // //////console.log(this.unsyncData)

              } else {
                let result;
                result = this.unsyncData.filter((item) => {
                  return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                })
                if (result.length < 1) {
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // //////console.log(this.unsyncData)

                } else {
                  // //////console.log(result)
                  let i;
                  i = this.unsyncData.findIndex(x => x.id == result[0].id)
                  this.unsyncData.splice(i, 1, params);
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // //////console.log(this.unsyncData)
                }
              }
            }).finally(() =>  {
              // //////console.log(this.unsyncData);
              // this.checkIfRepeat = "yes";
              // Promise.resolve(this.deliveryndata()).then(coldata => {
              // this.savePay(coldata);
              // })

              let params: any = {}
              params.rid = this.mySpecialID
              params.coldelID = this.mySpecialID
              params.custID = this.deliveryDetails.cui
              params.accID = this.deliveryDetails.com
              // params.credit = this.newCustomerCredit
              params.invoiceno = ""
              params.invoicetype = "Repeat"
              params.invcompany = tag

              params.UCOtimestamp = "UCOtimestamp" //new UCO will be generated in the collection loop if necessary
              params.UCOcusttype = this.deliveryDetails.cut //30-11-2012 for checking minimum
              params.UCOcollecttype = this.deliveryDetails.del
              params.UCOcollectdate = this.defaultSrvc.getToday()
              params.UCOcollecttime = this.deliveryDetails.det
              params.UCOcollectaddress = this.deliveryDetails.dea
              params.UCOcollectunit = this.deliveryDetails.dun
              params.UCOcollectpostal = this.deliveryDetails.dpc
              params.UCOcollectbuilding = this.deliveryDetails.deb
              params.UCOcollectregion = this.deliveryDetails.ren
              params.UCOcollectnote = ""
              params.UCOcollectstatus = "collected"
              params.UCOreturndate = "0000-00-00"
              params.UCOreturntime = "A 10 - 12pm"
              params.done = "A 10 - 12pm"
              params.syncserver = "false"
              params.driversId = this.driversDetails.id
              params.invoicesynctype = 'Repeat'
            
              // this.storage.set('UNSYNCOLLECTIONLOCAL', params).then( datas => {
                this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
                  this.unsyncDataCollection = res
                  // //////console.log(this.unsyncData)
    
                  if (res == null) {
                    this.unsyncDataCollection = []
                    this.unsyncDataCollection.push(params)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    // //////console.log(this.unsyncData)
    
                  } else {
                    let result;
                    result = this.unsyncDataCollection.filter((item) => {
                      return (item.rid.indexOf(params.rid) !== -1)
                    })
                    if (result.length < 1) {
                      this.unsyncDataCollection.push(params)
                      this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                      // //////console.log(this.unsyncData)
    
                    } else {
                      // //////console.log(result)
                      let i;
                      i = this.unsyncDataCollection.findIndex(x => x.id == result[0].id)
                      this.unsyncDataCollection.splice(i, 1, params);
                      // //////console.log(this.unsyncData)
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
            //   //////console.log(e);
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
            params.UNINV_DELIVERYTIMESLOT = 'A 10 - 12pm'
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
            params.UNINV_SAVEDON = this.todaydate
            params.syncserver = "false"
            // params.customerCredit = this.newCustomerCredit
            params.driversId = this.driversDetails.id
            params.invoicesynctype = 'Repeat'
            //////console.log(params)


            await this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              // //////console.log(this.unsyncData)

              if (res == null) {
                this.unsyncData = []
                this.unsyncData.push(params)
                this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                // //////console.log(this.unsyncData)

              } else {
                let result;
                result = this.unsyncData.filter((item) => {
                  return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                })
                if (result.length < 1) {
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // //////console.log(this.unsyncData)

                } else {
                  // //////console.log(result)
                  let i;
                  i = this.unsyncData.findIndex(x => x.id == result[0].id)
                  this.unsyncData.splice(i, 1, params);
                  // //////console.log(this.unsyncData)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                }
              }
            }).finally(() => {
              // //////console.log(this.unsyncData);
              // this.defaultSrvc.getTempItems = null

              // this.checkIfRepeat = "yes";

              let params: any = {}
                params.rid = this.mySpecialID
                params.coldelID = this.mySpecialID
                params.custID = this.deliveryDetails.cui
                params.accID = this.deliveryDetails.com
                // params.credit = this.newCustomerCredit
                params.invoiceno = ""
                params.invoicetype = "Repeat"
                params.invcompany = tag

                params.UCOtimestamp = this.mySpecialID, //new UCO will be generated in the collection loop if necessary
                params.UCOcusttype = this.deliveryDetails.cut, //30-11-2012 for checking minimum
                params.UCOcollecttype = this.deliveryDetails.del
                params.UCOcollectdate = this.defaultSrvc.getToday()
                params.UCOcollecttime = this.deliveryDetails.det,
                params.UCOcollectaddress = this.deliveryDetails.dea
                params.UCOcollectunit = this.deliveryDetails.dun
                params.UCOcollectpostal = this.deliveryDetails.dpc
                params.UCOcollectbuilding = this.deliveryDetails.deb
                params.UCOcollectregion = this.deliveryDetails.ren
                params.UCOcollectnote = ""
                params.UCOcollectstatus = "collected"
                params.UCOreturndate = "0000-00-00"
                params.UCOreturntime = "A 10 - 12pm"
                params.syncserver = "false"
                params.driversId = this.driversDetails.id
                params.invoicesynctype = 'Repeat'
              
              // this.storage.set('UNSYNCOLLECTIONLOCAL', params).then(datas => {
                this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
                  this.unsyncDataCollection = res
                  // //////console.log(this.unsyncData)
    
                  if (res == null) {
                    this.unsyncDataCollection = []
                    this.unsyncDataCollection.push(params)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    // //////console.log(this.unsyncData)
    
                  } else {
                    let result;
                    result = this.unsyncDataCollection.filter((item) => {
                      return (item.rid.indexOf(params.rid) !== -1)
                    })
                    if (result.length < 1) {
                      this.unsyncDataCollection.push(params)
                      this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                      // //////console.log(this.unsyncData)
    
                    } else {
                      // //////console.log(result)
                      let i;
                      i = this.unsyncDataCollection.findIndex(x => x.id == result[0].id)
                      this.unsyncDataCollection.splice(i, 1, params);
                      // //////console.log(this.unsyncData)
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
            //   //////console.log(e);
            // });
          }
        }
      ],
    });

    await alert.present();

  }


  async savePay(offlinedata) {
    //////console.log(offlinedata)
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
      inn: this.inn,
      driversId : this.driversDetails.id
    }
    //////console.log(this.inn)
    this.finaldeliverydata.push(params)
    // await this.presentLoading('Syncing local Data');
    ////update UNSYNCED_INVOICE_TABLE

    await this.storage.get('UNSYNCED_PAYMENT_TABLE').then(res => {
      this.finaldeliverydata = res
      // //////console.log(this.unsyncData)

      if (res == null) {
        this.finaldeliverydata = []
        this.finaldeliverydata.push(params)
        this.storage.set('UNSYNCED_PAYMENT_TABLE', this.finaldeliverydata)
        // //////console.log(this.unsyncData)

      } else {
        let result;
        result = this.finaldeliverydata.filter((item) => {
          return (item.delid.indexOf(offlinedata.delid) !== -1)
        })
        if (result.length < 1) {
          this.finaldeliverydata.push(params)
          this.storage.set('UNSYNCED_PAYMENT_TABLE', this.finaldeliverydata)
          // //////console.log(this.unsyncData)

        } else {
          // //////console.log(result)
          let i;
          i = this.finaldeliverydata.findIndex(x => x.id == result[0].id)
          this.finaldeliverydata.splice(i, 1, params);
          // //////console.log(this.unsyncData)
          this.storage.set('UNSYNCED_PAYMENT_TABLE', this.finaldeliverydata)
        }
      }
    }).finally(() => {
      this.storage.get('UNSYNCED_PAYMENT_TABLE').then(ress => {
        //////console.log(ress)
      }).finally(() =>{
        this.offlinedeliveryUpdate(offlinedata);
      })
    })

    // await this.storage.get('UNSYNCED_PAYMENT_TABLE').then(res => {
    //   let data
    //   data = res
    //   let filtered: any = []
    //   //////console.log(data)

    //   if (data != "") {
    //     data.forEach(unsync => {
    //       if (unsync.delid == offlinedata.delid) {
    //         filtered.push(this.finaldeliverydata)
    //       } else {
    //         filtered.push(unsync)
    //       }
    //     });
    //     this.storage.set('UNSYNCED_PAYMENT_TABLE', filtered)
    //   } else {
    //     this.storage.set('UNSYNCED_PAYMENT_TABLE', this.finaldeliverydata)
    //     // this.loading.dismiss();
    //   }

    // }).finally(() => {
    //   this.storage.get('UNSYNCED_PAYMENT_TABLE').then(ress => {
    //     //////console.log(ress)
    //   })
    //   this.offlinedeliveryUpdate(offlinedata);
    // })

   
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
