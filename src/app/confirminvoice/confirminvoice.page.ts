import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { Network } from '@ionic-native/network/ngx';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';
import { SyncinvoiceService } from '../api/syncinvoice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirminvoice',
  templateUrl: './confirminvoice.page.html',
  styleUrls: ['./confirminvoice.page.scss'],
})
export class ConfirminvoicePage implements OnInit {

  loading: any = new LoadingController;

  customerData: any
  isLoading: boolean = false
  invoicedata: any

  checkAccount = 0;
  company: any;

  invoiceId: any;
  invoiceType: any;
  invoiceNumber: any
  customerID: any
  driver_name: any
  promotionItem: any;
  invoiceNotes: any;

  dataOffline: any = {}

  //sample default item
  newItems: any = '{"cat_type":"Clothing","description":"Cheong Sam","clean_type":"Dry Clean","ready_type":"Pack","price":"16.00","is_ready":"no","qty":2.00,"pieces":2.00}';

  expressData: any = "1.00"


  finalSubtotal: any = 0;
  percentPromo: any
  percentPromoAmount: number = 0;
  percentPromoAmountFM: any = 0;
  invoiceSyncLink: any;

  // percentValue: any;
  convertedPercent: any;
  afterLessAmount: any;
  expressAmount: any;
  expressPercent: number = 0;
  payableAmount: any;
  expressCharge: any = "None";
  depositAmount: any = "0.00";
  balanceAmount: number = 0;
  returnDate: any;
  customerTypes: any;
  driver_email: any
  driver_password: any
  invoiceTypeID: any

  UNINV_AGREEDDELIVERYDATE: any
  UNINV_BAGS: any
  UNINV_BALANCE: any
  UNINV_COLLID: any
  UNINV_COLLTS: any
  UNINV_CUSTID: any
  UNINV_DELIVERYTIMESLOT: any
  UNINV_DEPOAMT: any
  UNINV_DEPOTYPE: any
  UNINV_DISCOUNT: any
  UNINV_DONATE: any
  UNINV_EXPRESS: any
  UNINV_HASDONATE: any
  UNINV_INITIAL: any
  UNINV_INVNO: any
  UNINV_INVOICENOTE: any = ""
  UNINV_SAVEDON: any
  UNINV_TYPE: any

  allinvoiceitems: any = []
  itemsArray: any = []
  itemObject: any = {}

  invoiceNotesArray: any = []
  invoiceNotesObject: any = {}

  overDue: any;
  todaydate: any;

  customercredit: any;
  paymentMethod: any = "Cash";

  datePickerObj: any = {};
  initDELIVERYDATE: any
  public onlineOffline: boolean = navigator.onLine;

  timeslots: any = []
  selectedtime: any

  constructor(
    public alertController: AlertController,
    private defaultSrvc: DefaultsService,
    private storage: Storage,
    private network: Network,
    public datepipe: DatePipe,
    public modalCtrl: ModalController,
    public syncinvoiceSrvs: SyncinvoiceService,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private router: Router,
  ) {
    this.datePickerObj = {
      // inputDate: new Date('12'), // If you want to set month in date-picker
      // inputDate: new Date('2018'), // If you want to set year in date-picker
      // inputDate: new Date('2018-12'), // If you want to set year & month in date-picker
      // inputDate: new Date("2018-12-01"), // If you want to set date in date-picker
      inputDate: new Date(), // If you want to set date in date-picker

      // inputDate: this.mydate,
      // dateFormat: 'yyyy-MM-DD',
      dateFormat: "MMM DD YYYY",
      // fromDate: new Date('2018-12-08'), // default null
      // toDate: new Date('2018-12-28'), // default null
      // showTodayButton: true, // default true
      // closeOnSelect: false, // default false
      // disableWeekDays: [4], // default []
      // mondayFirst: false, // default false
      // setLabel: 'S',  // default 'Set'
      // todayLabel: 'T', // default 'Today'
      // closeLabel: 'C', // default 'Close'
      // disabledDates: disabledDates, // default []
      titleLabel: "Select a Date", // default null
      // monthsList: this.monthsList,
      // weeksList: this.weeksList,
      momentLocale: "en",
      yearInAscending: true,
      clearButton: false,

    };
  }

  ngOnInit() {
    this.getToday();
    this.isLoading = true
    this.storage.get('SELECTED_ITEM').then(res => {
      console.log(res)
      this.isLoading = false
      this.invoiceId = res.id;
      console.log(this.invoiceId);
    })

    this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      this.isLoading = true
      console.log(res)
      var l = res.length, i;
      for (i = 0; i < l; i++) {
        if (res[i].UNINV_COLLID == this.invoiceId) {
          this.customerData = res[i];
        }
      }
      // this.storage.remove('ENVNUM_TABLE')
      // this.storage.remove('UNSYNCED_INVOICE_TABLE')
      Promise.resolve(this.defaultSrvc.createInvSeries()).then(data => {
        console.log(data);
        this.UNINV_INVNO = data
        this.invoiceNumber = data
      }).catch(e => {
        console.log(e);
      });

      this.company = this.customerData.UNINV_INITIAL
      this.invoiceType = this.customerData.UNINV_TYPE
      this.customerID = this.customerData.UNINV_CUSTID
      this.selectedtime = this.customerData.UNINV_DELIVERYTIMESLOT
      const initDeliveryDate = this.customerData.UNINV_AGREEDDELIVERYDATE
      this.initDELIVERYDATE = initDeliveryDate
      this.isLoading = false
      this.UNINV_AGREEDDELIVERYDATE = this.customerData.UNINV_AGREEDDELIVERYDATE == '0000-00-00' ? this.datepipe.transform(new Date(this.getDay(7)), 'yyyy-MM-dd') : this.customerData.UNINV_AGREEDDELIVERYDATE
      this.UNINV_BAGS = this.customerData.UNINV_BAGS
      this.UNINV_BALANCE = this.customerData.UNINV_BALANCE
      this.UNINV_COLLID = this.customerData.UNINV_COLLID
      this.UNINV_COLLTS = this.customerData.UNINV_COLLTS
      this.UNINV_CUSTID = this.customerData.UNINV_CUSTID
      this.UNINV_DELIVERYTIMESLOT = this.customerData.UNINV_DELIVERYTIMESLOT
      this.UNINV_DEPOAMT = this.customerData.UNINV_DEPOAMT
      this.UNINV_DEPOTYPE = this.customerData.UNINV_DEPOTYPE
      this.UNINV_DISCOUNT = this.customerData.UNINV_DISCOUNT
      this.UNINV_DONATE = this.customerData.UNINV_DONATE
      this.UNINV_EXPRESS = this.customerData.UNINV_EXPRESS
      this.UNINV_HASDONATE = this.customerData.UNINV_HASDONATE
      this.UNINV_INITIAL = this.customerData.UNINV_INITIAL
      this.UNINV_INVNO = this.customerData.UNINV_INVNO
      this.UNINV_SAVEDON = this.customerData.UNINV_SAVEDON
      this.UNINV_TYPE = this.customerData.UNINV_TYPE

      console.log(this.customerData);


      this.storage.get('INVOICE_TYPES_TABLE').then(res => {
        console.log(res)
        var l = res.length, i;
        for (i = 0; i < l; i++) {
          if (res[i].description == this.invoiceType) {
            this.invoiceTypeID = res[i].id
            console.log(this.invoiceTypeID);
          }
        }
      })
      this.alertCustomerType();
    })

    this.storage.get('SELECTED_ITEM').then(res => {
      console.log(res)
      this.returnDate = res.coldel_return;
      this.customercredit = res.cca;
      this.customerTypes = res.cut;
      // console.log(this.returnDate)
      // console.log(this.customercredit)
      // console.log(this.customerTypes)
    })

    this.storage.get('COLDEL_TABLE').then(res => {
      var l = res.length, i;
      for (i = 0; i < l; i++) {
        if (res[i].id == this.invoiceId) {
          this.returnDate += res[i].coldel_return;
        }
        // for (i = 0; i < l; i++) {
        //   if (res[i].id == this.invoiceId) {
        //     this.returnDate = res[i].coldel_return;
        //   }
      }
      console.log(this.returnDate)
    })

    this.storage.get('TIMESLOT_TABLE').then(res => {
      // this.timeslots = res
      res.forEach(element => {
        this.timeslots.push(element.description)
      });
      // console.log(this.timeslots)
      this.isLoading = false
    })

    this.storage.get('ACCOUNTS_TABLE').then(res => {
      console.log(res)
      this.driver_email = res.email_address
      this.driver_password = res.password
      this.driver_name = res.name
    })


    this.getItemSubtotal();
  }

  getItemSubtotal() {
    if (this.checkAccount == 1) {
      this.storage.get("TEMP_RATES_TABLE").then(res => {
        var flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (res[i].rid == this.invoiceId && res[i].qty != 0) {
            let params = {
              "cat_type": res[i].cat_type,
              "description": res[i].description,
              "clean_type": res[i].clean_type,
              "ready_type": res[i].ready_type,
              "price": parseFloat(res[i].price),
              "is_ready": res[i].is_ready,
              "qty": parseFloat(res[i].qty),
              "pieces": parseFloat(res[i].pieces)
            }
            this.allinvoiceitems.push(params);
            // this.allinvoiceitems = this.allinvoiceitems.concat(params)
            // this.allinvoiceitems = params
            this.finalSubtotal = this.finalSubtotal + res[i].subtotal;
          }
        }
        console.log(this.finalSubtotal)
        this.payableAmount = this.finalSubtotal;
        this.afterLessAmount = this.finalSubtotal;
        this.balanceAmount = this.finalSubtotal;
        if (this.finalSubtotal > 30) {
          this.addDiscount();
        }

      })
    } else if (this.checkAccount == 0) {
      this.storage.get("TEMP_ITEMS_TABLE").then(res => {
        // console.log(res)
        var str1, flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (res[i].rid == this.invoiceId && res[i].qty != 0) {
            console.log(res[i])

            let params = {
              "cat_type": res[i].cat_type,
              "description": res[i].description,
              "clean_type": res[i].clean_type,
              "ready_type": res[i].ready_type,
              "price": parseFloat(res[i].price),
              "is_ready": res[i].is_ready,
              "qty": parseFloat(res[i].qty),
              "pieces": parseFloat(res[i].pieces)
            }
            this.allinvoiceitems.push(params);
            // this.itemsArray.push(this.itemObject);
            this.finalSubtotal = this.finalSubtotal + res[i].subtotal;
          }
        }
        console.log(this.allinvoiceitems)
        console.log(this.finalSubtotal)
        this.payableAmount = this.finalSubtotal;
        this.afterLessAmount = this.finalSubtotal;
        this.balanceAmount = this.finalSubtotal;
        if (this.finalSubtotal > 30) {
          this.addDiscount();
        }
      })
    }

  }

  getDay(num) {
    let today;
    let dd = new Date().getDate() + (num ? num : 0);
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let yy = (yyyy + '').substr(2, 2);

    // today = yyyy + '-' + mm + '-' + dd;
    // console.log(today)
    today = this.datepipe.transform(new Date(yyyy + '-' + mm + '-' + dd), 'dd MMM yyyy');
    return today
  }

  formatDate(sdate) {
    let initialDate
    initialDate = this.datepipe.transform(new Date(sdate), 'dd MMM yyyy');
    return initialDate
  }

  async openDatePicker() {
    console.log("Open Date PIcker");
    const modalCtrl = await this.modalCtrl.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: "li-ionic4-datePicker",
      componentProps: { objConfig: this.datePickerObj }
    });
    await modalCtrl.present();

    modalCtrl.onDidDismiss().then(data => {
      // this.isModalOpen = false;
      this.customerData.UNINV_AGREEDDELIVERYDATE = this.datepipe.transform(new Date(data['data'].date), 'yyyy-MM-dd')
      console.log(data['data'].date);
      // this.selectedDate = data.data.date;
    });
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

    today = yyyy + '-' + mm + '-' + dd + " " + hr + ":" + min + ":" + ss;
    this.todaydate = today
    console.log(this.todaydate)
  }

  async presentAlert2(msg) {
    const alert = await this.alertController.create({
      message: msg,
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: "% must be 100 or Less",
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();
  }

  async amountValue() {
    const alert = await this.alertController.create({
      message: "minimum for " + this.customerTypes + " is $30!",
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();
  }
  // getDate(){
  // this.datePicker.show({
  //   date: new Date(),
  //   mode: 'date',
  //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_TRADITIONAL
  // }).then(
  //   date => console.log('Got date: ', date),
  //   err => console.log('Error occurred while getting date: ', err)
  // );
  // }

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




  showFinal(finalSubtotal) {
    this.finalSubtotal = finalSubtotal
  }

  getTime(selectedtime) {
    console.log(selectedtime);
    this.UNINV_DELIVERYTIMESLOT = this.selectedtime
  }

  alertCustomerType() {
    if (this.customerTypes == "HDB" && (this.payableAmount < 30)) {
      this.amountValue()
    } else if (this.customerTypes == "Condo" && (this.payableAmount < 30)) {
      this.amountValue()
    } else if (this.customerTypes == "Landed" && (this.payableAmount < 30)) {
      this.amountValue()
    } else {

    }
  }

  addDiscount() {
    if (this.invoiceType == "Repeat" && (this.finalSubtotal > 30) && (this.company != "DC")) {
      //create promotion object
      this.storage.get('ACCOUNTS_TABLE').then(res => {
        console.log(res)
        let params: any = {};
        params.description = "Chain Promotion";
        params.cat_type = "";
        params.clean_type = "Promotion";
        params.is_ready = "Yes"
        params.price = "0"
        params.qty = "1"
        params.pieces = "0"
        params.subtotal = "-3"
        params.updated_by = res.name
        params.updated_on = this.defaultSrvc.getToday();
        params.rid = this.invoiceId

        this.promotionItem = params;
      })

      this.storage.get("TEMP_ITEMS_TABLE").then(res => {
        console.log(res)
        console.log(this.promotionItem)
        let result;
        result = res
        result.push(this.promotionItem)
        console.log(result)
      })

      this.payableAmount = this.finalSubtotal - 3;
      this.afterLessAmount = this.finalSubtotal - 3;
      this.balanceAmount = this.finalSubtotal - 3;
    }
  }



  lessPromotion(percentPromo) {
    if (percentPromo > 100) {
      this.presentAlert();
      this.percentPromo = "0";
    } else {
      // this.percentValue = percentPromo;
      this.getTotalPayable();
    }
  }

  getexpressAmount(expressCharge) {
    this.expressCharge = expressCharge
    if (this.expressCharge == "None") {
      this.expressData = "1.00"
    } else if (this.expressCharge == "50") {
      this.expressData = "1.50"
    } else if (this.expressCharge == "100") {
      this.expressData = "2.00"
    }
    console.log(this.expressCharge)
    this.getTotalPayable();
  }

  getDeposit(depositAmount) {
    this.depositAmount = depositAmount;
    if (this.depositAmount == undefined) {
      this.depositAmount = "0.00";
    }
    this.getTotalPayable();
  }

  getPayemntMethod(paymentMethod) {
    this.paymentMethod = paymentMethod
    console.log(this.paymentMethod)
  }

  // overDueAmount(overDue){
  //   this.overDue = overDue;
  //   this.getTotalPayable();
  // }

  getTotalPayable() {
    if (this.percentPromo > 0) {
      this.convertedPercent = (this.percentPromo / 1000) * 10
      this.percentPromoAmountFM = this.finalSubtotal * this.convertedPercent
      this.percentPromoAmount = Math.round(this.percentPromoAmountFM * 100) / 100
      this.afterLessAmount = this.finalSubtotal - this.percentPromoAmount
      this.payableAmount = this.afterLessAmount
      console.log(this.payableAmount);
    } else if (this.percentPromo <= 0 || this.percentPromo == "") {
      this.afterLessAmount = this.finalSubtotal
      this.payableAmount = this.finalSubtotal
      console.log(this.payableAmount);
    }

    if (this.expressCharge != "None" && this.expressCharge != "" && this.expressCharge != 0 && this.expressCharge != undefined) {
      this.expressPercent = (this.expressCharge / 1000) * 10

      if (this.afterLessAmount != null || this.afterLessAmount != 0) {
        this.expressAmount = this.afterLessAmount * this.expressPercent
        this.payableAmount = this.afterLessAmount + this.expressAmount
      } else {
        this.payableAmount = this.afterLessAmount
      }
    } else if (this.expressCharge == "None") {
      this.expressPercent = 0
    }

    if (this.depositAmount == 0 || this.depositAmount == undefined) {
      this.balanceAmount = this.payableAmount
    } else {
      this.balanceAmount = this.payableAmount - this.depositAmount
    }

  }


  confirmAndCreatePayment() { //KIV
    //generate new invoice
    if (this.invoiceType == "Repeat") {
      //update summary_table for repeat -- later part(KIV)
    } else if (this.invoiceType == "Pending") {
      //update summary_table for pending -- later part(KIV)
    } else {
      //update summary_table for new and others -- later part(KIV)
    }

    if (navigator.onLine == true) {
      this.syncPay()
    } else {
      Promise.resolve(this.collectiondata()).then(coldata => {
        this.savePay(coldata)
      })
    }
  }

  confirmPayment() {
    if (this.invoiceType == "Repeat") {
      //update summary_table for repeat -- later part(KIV)
    } else if (this.invoiceType == "Pending") {
      //update summary_table for pending -- later part(KIV)
    } else {
      //update summary_table for new and others -- later part(KIV)
    }

    if (navigator.onLine == true) {
      this.syncPay()
    } else {
      Promise.resolve(this.collectiondata()).then(coldata => {
        this.savePay(coldata)
      })
    }

  }

  //no connection
  async savePay(offlinedata) {
    await this.presentLoading('Syncing local Data');
    ////update UNSYNCED_INVOICE_TABLE
    await this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      let data
      data = res
      let filtered: any = []

      if(data != null){
        data.forEach(unsync => {
          if (unsync.UNINV_INVNO == offlinedata.invoiceno) {
            let params = {
              UNINV_AGREEDDELIVERYDATE: offlinedata.agreeddeliverydate,
              UNINV_BAGS: offlinedata.bags,
              UNINV_BALANCE: offlinedata.balancepaid,
              UNINV_COLLID: offlinedata.collectionid,
              UNINV_COLLTS: offlinedata.savedon,
              UNINV_CUSTID: offlinedata.customerid,
              UNINV_DELIVERYTIMESLOT: offlinedata.deliverytimeslot,
              UNINV_DEPOAMT: offlinedata.depositamount,
              UNINV_DEPOTYPE: offlinedata.deposittype,
              UNINV_DISCOUNT: offlinedata.discount,
              UNINV_DONATE: offlinedata.donatetotal,
              UNINV_EXPRESS: offlinedata.express,
              UNINV_HASDONATE: offlinedata.hasdonate,
              UNINV_INITIAL: offlinedata.initial,
              UNINV_INVNO: offlinedata.invoiceno,
              UNINV_INVOICENOTE: offlinedata.invoicenote,
              UNINV_SAVEDON: offlinedata.savedon,
              UNINV_TYPE: offlinedata.type,
              drvna: offlinedata.name,
              drvpa: offlinedata.password,
              drvem: offlinedata.email,
              colitem: offlinedata.invoiceitem
            }
            filtered.push(params)
          } else {
            filtered.push(unsync)
          }
        });
        this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
        this.loading.dismiss();
      }else{
        let params = {
          UNINV_AGREEDDELIVERYDATE: offlinedata.agreeddeliverydate,
          UNINV_BAGS: offlinedata.bags,
          UNINV_BALANCE: offlinedata.balancepaid,
          UNINV_COLLID: offlinedata.collectionid,
          UNINV_COLLTS: offlinedata.savedon,
          UNINV_CUSTID: offlinedata.customerid,
          UNINV_DELIVERYTIMESLOT: offlinedata.deliverytimeslot,
          UNINV_DEPOAMT: offlinedata.depositamount,
          UNINV_DEPOTYPE: offlinedata.deposittype,
          UNINV_DISCOUNT: offlinedata.discount,
          UNINV_DONATE: offlinedata.donatetotal,
          UNINV_EXPRESS: offlinedata.express,
          UNINV_HASDONATE: offlinedata.hasdonate,
          UNINV_INITIAL: offlinedata.initial,
          UNINV_INVNO: offlinedata.invoiceno,
          UNINV_INVOICENOTE: offlinedata.invoicenote,
          UNINV_SAVEDON: offlinedata.savedon,
          UNINV_TYPE: offlinedata.type,
          drvna: offlinedata.name,
          drvpa: offlinedata.password,
          drvem: offlinedata.email,
          colitem: offlinedata.invoiceitem
        }
        this.storage.set('UNSYNCED_INVOICE_TABLE', params)
        this.loading.dismiss();
      }

    }).finally(() => {
      this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
        console.log(res)
      })
    })

    this.offlineCollectionUpdate(offlinedata);
  }

  offlineCollectionUpdate(offlinedata){
    this.storage.get('COLDEL_TABLE').then(res => {
      let data, colid
      data = res
      let filtered: any = []

      colid = res.type == 'collection' ? res.findIndex(x => x.id == res.id) : res.findIndex(x => x.dei == res.dei)
      console.log(colid)

      data.forEach(coldelData => {
        if (coldelData.id == offlinedata.collectionid) {
          let params = {
            aid: coldelData.aid,
            cca: coldelData.cca,
            cn1: coldelData.cn1,
            cn2: coldelData.cn2,
            cn3: coldelData.cn3,
            coa: coldelData.coa,
            cob: coldelData.cob,
            cod: coldelData.cod,
            col: coldelData.col,
            coldel_flag: coldelData.coldel_flag,
            coldel_hang: coldelData.coldel_hang,
            coldel_pack: coldelData.coldel_pack,
            coldel_return: coldelData.coldel_return,
            coldel_roll: coldelData.coldel_roll,
            coldel_type: coldelData.coldel_type,
            com: coldelData.com,
            con: coldelData.con,
            cot: coldelData.cot,
            cpc: coldelData.cpc,
            cue: coldelData.cue,
            cui: coldelData.cui,
            cun: coldelData.cun,
            cuo: coldelData.cuo,
            cut: coldelData.cut,
            driver_id: coldelData.driver_id,
            email_address: coldelData.email_address,
            id: coldelData.id,
            lil: coldelData.lil,
            mobile_no: coldelData.mobile_no,
            na2: coldelData.na2,
            name: coldelData.name,
            noe: coldelData.noe,
            office_no: coldelData.office_no,
            pax: coldelData.pax,
            ren: coldelData.ren,
            rtd: coldelData.rtd,
            rtt: coldelData.rtt,
            sts: "Collected",
            uby: coldelData.uby,
            uon: coldelData.uon
          }
          filtered.push(params)
        } else {
          filtered.push(coldelData)
        }
      });
      this.storage.set('COLDEL_TABLE', filtered)
      this.loading.dismiss();
    }).finally(() => {
      this.storage.get('COLDEL_TABLE').then(ress => {
        console.log(ress)
        // this.router.navigate(['/coldev']);
      })
    })
  }

  //with connection
  async syncPay() {
    Promise.resolve(this.collectiondata()).then(coldata => {
      if (navigator.onLine == true) {
        Promise.resolve(this.syncinvoiceSrvs.addinvoiceService(coldata)).then(data => {
          if (data == true) {
            this.presentAlert2("Invoice Successfully Sync")
            this.offlineCollectionUpdate(coldata);
            this.router.navigate(['/coldev']);
          } else if (data == "duplicate") {
            this.presentAlert2("Duplicate Invoice")
            this.router.navigate(['/coldev']);
            this.savePay(coldata);
          } else {
            this.presentAlert2("Cannot sync, poor internet connection. Please save later")
            this.savePay(coldata);
          }
        }).catch(e => {
          console.log(e);
          this.presentAlert2("Cannot sync, poor internet connection. Please save later")
          this.savePay(coldata);
        });
      } else {
        this.presentAlert2("Cannot sync, poor internet connection. Please save later")
        this.savePay(coldata);
      }
    })
    //// get "collection", selectedDate, coldelID) to delete on local table if successful

    //if (successful){
    //// delete on COLDEL_TABLE where = "collection", selectedDate, coldelID)
    //// delete on TEMP_ITEMS_TABLE whererid = current invoice id
    //// delete on UNSYNCED_INVOICE_TABLE where tumestamp =  timestamp of selected invoice

    ///// SYNCED_INVOICE_TABLE sync all successful - later part (KIV)

    //}else{
    // this.savePay();
    //}
  }

  collectiondata() {
    return new Promise(resolve => {
      if (this.UNINV_INVOICENOTE != "") {
        this.invoiceNotes = '[{"note":"' + this.UNINV_INVOICENOTE + '"}]';
        //   this.invoiceNotes =  this.invoiceNotesArray.push(this.invoiceNotesArray)
      } else {
        var json = '[{"note":""}]';
        this.invoiceNotes = json;
      }
      var myObj = JSON.stringify(this.allinvoiceitems);
      var myStringRep = JSON.stringify(myObj);
      var removeQuote = myStringRep.replace("\"[{", "[{");
      var finalstring = removeQuote.replace("}]\"", "}]");
      var mystringnotes = JSON.stringify(this.invoiceNotes);
      var removeNotesQuote = mystringnotes.replace("\"[{", "[{");
      var finalstringNotes = removeNotesQuote.replace("}]\"", "}]");

      let params = {
        email: this.driver_email,
        password: this.driver_password,
        initial: this.company,
        customerid: this.customerID,
        collectionid: this.invoiceId,
        invoiceno: this.invoiceNumber,
        type: this.invoiceTypeID,
        depositamount: this.depositAmount,
        deposittype: this.paymentMethod,
        balancepaid: "0.00",
        name: this.driver_name,
        agreeddeliverydate: this.UNINV_AGREEDDELIVERYDATE,
        deliverytimeslot: this.UNINV_DELIVERYTIMESLOT,
        invoiceitem: finalstring.toString(),
        invoicenote: finalstringNotes.toString(),
        hasdonate: this.UNINV_DONATE,
        donatetotal: this.UNINV_DONATE,
        discount: this.percentPromo,
        express: this.expressData,
        bags: this.UNINV_BAGS,
        savedon: this.todaydate
      }
      resolve(params)
    }).catch(e => {
      console.log(e);
    });
  }



  payAction() {
    if (this.invoiceType == "Repeat") {
      //update summary_table for repeat -- later part(KIV)
    } else if (this.invoiceType == "Pending") {
      //update summary_table for pending -- later part(KIV)
    } else {
      //update summary_table for new and others -- later part(KIV)
    }

    ////check connection
    if (!navigator.onLine) {
      Promise.resolve(this.collectiondata()).then(coldata => {
        this.savePay(coldata)
      })
    } else {
      this.syncPay()
    }

  }


}