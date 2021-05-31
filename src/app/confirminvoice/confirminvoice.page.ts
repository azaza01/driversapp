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

  customerData: any = ""
  isLoading: boolean = false
  invoicedata: any

  unsyncDataCollection: any
  unsyncData: any

  proceedtoWherePage: any

  rateusdata: any

  checkAccount = 0;
  company: any;

  summdata: any

  mySpecialIDCol: any

  invoiceId: any = ""
  invoiceType: any;
  invoiceNumber: any
  customerID: any
  driver_name: any
  promotionItem: any;
  invoiceNotes: any;

  dataOffline: any = {}
  canSyncNow: any

  dataForCreateNewCollection: any

  todaydateonly: any

  checkIfRepeat: any

  //sample default item
  newItems: any

  expressData: any = "1.00"


  finalSubtotal: any = 0;
  percentPromo: any = 0
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
  driversDetails: any
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
  UNINV_DISCOUNT: any = 0
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

  servicetype: any

  invoiceNotesArray: any = []
  invoiceNotesObject: any = {}

  drvna: any
  drvpa: any
  drvem: any
  colitem: any


  overDue: any;
  todaydate: any;
  validationforsync: any

  customercredit: any;
  paymentMethod: any = "Cash";

  datePickerObj: any = {};
  initDELIVERYDATE: any
  public onlineOffline: boolean = navigator.onLine;

  timeslots: any = []
  selectedtime: any
  newSeriesofInvoice: any

  newInvoiceCollection: any = "false"

  driversId: any

  typeofSync: any
  isCollection: any

  constructor(
    public alertController: AlertController,
    private defaultSrvc: DefaultsService,
    private storage: Storage,
    private network: Network,
    public activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    public modalCtrl: ModalController,
    public syncinvoiceSrvs: SyncinvoiceService,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private router: Router
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

  async ngOnInit() {

    await this.presentLoading('Syncing local Data');
    this.invoiceType = ""
    this.customerData = ""
    this.invoiceId = ""
    this.typeofSync = ""
    this.dataForCreateNewCollection = ""
    this.getToday();
    this.isLoading = true

    this.storage.get('ACCOUNTS_TABLE').then(res => {
      //////console.log(res)
      this.driversDetails = res
      this.driver_email = res.email_address
      this.driver_password = res.password
      this.driver_name = res.name
    })


    this.storage.get('SELECTED_ITEM').then(res => {
      this.isLoading = false
      //console.log(res)
      if (res.coldel_type == "collection") {
        if (res.coldel_return == 'nil') {
          this.returnDate = "0000-00-00";
        } else {
          this.returnDate = res.coldel_return;
        }
        // this.customercredit = res.cca;
        this.customerTypes = res.cut;
        this.invoiceId = res.id
        this.servicetype = res.col
        ////console.log(this.invoiceId)
        this.dataForCreateNewCollection = res
        this.validationforsync = "true"
        this.isCollection = "true"
      } else if (res.coldel_type == "delivery") {
        this.newInvoiceCollection = "false"
        this.dataForCreateNewCollection = res
        this.invoiceId = res.dei
        //////console.log(this.invoiceId)
        this.returnDate = "0000-00-00"
        // this.customercredit = res.cca;
        this.customerTypes = res.cut;
        this.validationforsync = "false"
        this.servicetype = res.del
        this.isCollection = "false"
       //console.log(this.invoiceId)
        ////console.log(this.invoiceId)
      }


      ////console.log(this.dataForCreateNewCollection);
    }).finally(() => {
      this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
        this.isLoading = true

        var l = res.length, i;
        for (i = 0; i < l; i++) {
          if (res[i].UNINV_COLLID == this.invoiceId) {
            this.customerData = res[i];
            this.typeofSync = res[i].invoicesynctype
           //console.log(this.customerData)
          }
        }


        this.storage.get('TIMESLOT_TABLE').then(res => {
          // this.timeslots = res
          res.forEach(element => {
            this.timeslots.push(element.description)
          });
          // //////console.log(this.timeslots)
          this.isLoading = false
        })

        Promise.resolve(this.defaultSrvc.createInvSeries()).then(data => {
          //////console.log(data)
          this.newSeriesofInvoice = data
          this.UNINV_INVNO = this.newSeriesofInvoice.INV_NO
          this.invoiceNumber = this.newSeriesofInvoice.INV_NO
        }).catch(e => {
          //////console.log(e);
        });

        this.getItemSubtotal();

        this.company = this.customerData.UNINV_INITIAL
        this.invoiceType = this.customerData.UNINV_TYPE
        this.customerID = this.customerData.UNINV_CUSTID
        this.selectedtime = this.customerData.UNINV_DELIVERYTIMESLOT
        const initDeliveryDate = this.customerData.UNINV_AGREEDDELIVERYDATE
        this.initDELIVERYDATE = initDeliveryDate
        this.isLoading = false

        this.UNINV_AGREEDDELIVERYDATE = this.customerData.UNINV_AGREEDDELIVERYDATE == '0000-00-00' ? this.datepipe.transform(new Date(this.getDay(7)), 'yyyy-MM-dd') : this.customerData.UNINV_AGREEDDELIVERYDATE
        this.UNINV_BAGS = "1"
        this.UNINV_BALANCE = this.customerData.UNINV_BALANCE
        this.UNINV_COLLID = this.customerData.UNINV_COLLID
        this.UNINV_COLLTS = this.customerData.UNINV_SAVEDON
        this.UNINV_CUSTID = this.customerData.UNINV_CUSTID
        this.UNINV_DELIVERYTIMESLOT = this.customerData.UNINV_DELIVERYTIMESLOT
        this.UNINV_DEPOAMT = this.customerData.UNINV_DEPOAMT
        this.UNINV_DEPOTYPE = this.customerData.UNINV_DEPOTYPE
        this.UNINV_DISCOUNT = "0"
        this.UNINV_DONATE = this.customerData.UNINV_DONATE
        this.UNINV_EXPRESS = this.customerData.UNINV_EXPRESS
        this.UNINV_HASDONATE = this.customerData.UNINV_HASDONATE
        this.UNINV_INITIAL = this.customerData.UNINV_INITIAL
        this.UNINV_INVNO = this.UNINV_INVNO
        this.UNINV_INVOICENOTE = this.UNINV_INVOICENOTE
        this.UNINV_SAVEDON = this.customerData.UNINV_SAVEDON
        this.UNINV_TYPE = this.customerData.UNINV_TYPE
        this.drvna = this.driver_name
        this.drvpa = this.driver_password
        this.drvem = this.driver_email
        this.colitem = this.allinvoiceitems
        this.driversId = this.driversDetails.id


        this.storage.get('INVOICE_TYPES_TABLE').then(res => {
          // //////console.log(res)
          var l = res.length, i;
          for (i = 0; i < l; i++) {
            if (res[i].description == this.invoiceType) {
              this.invoiceTypeID = res[i].id
              // //////console.log(this.invoiceTypeID);
            }
          }
        })
        this.alertCustomerType();
      })
    })

    this.loading.dismiss();

  }

  getrate(checktorate){
    if(checktorate == true){
      this.rateusdata = 1
      console.log(this.rateusdata)
    }else{
      this.rateusdata = 0
      console.log(this.rateusdata)
    }
  }


  getItemSubtotal() {
    // if (this.checkAccount == 1) {
    //   this.storage.get("TEMP_ITEMS_TABLE").then(res => {
    //     var flags = [], output = [], l = res.length, i;
    //     for (i = 0; i < l; i++) {
    //       if (res[i].rid == this.invoiceId && (res[i].qty != 0 && res[i].qty != null)) {
    //         let params = {
    //           "cat_type": res[i].cat_type,
    //           "description": res[i].description,
    //           "clean_type": res[i].clean_type,
    //           "ready_type": res[i].ready_type,
    //           "price": parseFloat(res[i].price),
    //           "is_ready": res[i].is_ready,
    //           "qty": parseFloat(res[i].qty),
    //           "pieces": parseFloat(res[i].pieces)
    //         }
    //         this.allinvoiceitems.push(params);
    //         // this.allinvoiceitems = this.allinvoiceitems.concat(params)
    //         // this.allinvoiceitems = params
    //         this.finalSubtotal = this.finalSubtotal + res[i].subtotal;
    //       }
    //     }
    //     this.alertCustomerType()
    //     //console.log(this.allinvoiceitems)
    //     if (this.finalSubtotal > 30) {
    //       this.addDiscount();
    //     } else if (this.finalSubtotal <= 0 && this.customerData.UNINV_INITIAL == "CC") {
    //       this.coldev("Final amount is zero please click back button to refresh the amount");
    //     } else if (this.finalSubtotal <= 0 && this.customerData.UNINV_INITIAL == "DC") {
    //       this.coldev("Final amount is zero press back button to refresh or continue with the transaction ");
    //     }

    //   })
    // } else if (this.checkAccount == 0) {
      this.storage.get("TEMP_ITEMS_TABLE").then(res => {
        // //////console.log(res)
        var str1, flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (res[i].rid == this.invoiceId && (res[i].qty != 0 && res[i].qty != null)) {
            // //////console.log(res[i])

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
        // //////console.log(this.finalSubtotal)
        if (this.finalSubtotal > 30) {
          this.addDiscount();
        } else if (this.finalSubtotal <= 0 && this.customerData.UNINV_INITIAL == "CC") {
          this.coldev("Final amount is zero please click back button to refresh the amount");
        } else if (this.finalSubtotal <= 0 && this.customerData.UNINV_INITIAL == "DC") {
          this.coldev("Final amount is zero press back button to refresh or continue with the transaction ");
        }
      })
    // }


  }

  getDay(num) {
    let today;
    let dd = new Date().getDate() + (num ? num : 0);
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let yy = (yyyy + '').substr(2, 2);

    // today = yyyy + '-' + mm + '-' + dd;
    // //////console.log(today)
    var now = new Date();
    var mydays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    //console.log(mydays)

  
    if (dd > mydays) {
      var newdays
      newdays = dd - mydays
      if (mm == 12) {
        mm = 1
        yyyy = new Date().getFullYear() + 1;
      }else if(mm != 12){
        mm = mm + 1
       ////console.log(mm)
      }
      today = this.datepipe.transform(new Date(yyyy + '-' + mm + '-' + newdays), 'dd MMM yyyy');
    } else {
      today = this.datepipe.transform(new Date(yyyy + '-' + mm + '-' + dd), 'dd MMM yyyy');
    }



    return today
  }

  get7days(){

    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let yy = (yyyy + '').substr(2, 2);

    var dates = new Date(today)
    var newdate = dates.setDate(dates.getDate() + 7);
    var mynewdate = new Date(newdate)

    return mynewdate
  }

  formatDate(sdate) {
    let initialDate
    initialDate = this.datepipe.transform(new Date(sdate), 'dd MMM yyyy');
    return initialDate
  }

  async openDatePicker() {
    //////console.log("Open Date PIcker");
    const modalCtrl = await this.modalCtrl.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: "li-ionic4-datePicker",
      componentProps: { objConfig: this.datePickerObj }
    });
    await modalCtrl.present();

    modalCtrl.onDidDismiss().then(data => {
      // this.isModalOpen = false;
      //////console.log(data.data.date)
      this.customerData.UNINV_AGREEDDELIVERYDATE = this.datepipe.transform(new Date(data.data.date), 'yyyy-MM-dd')
      this.UNINV_AGREEDDELIVERYDATE = this.datepipe.transform(new Date(data.data.date), 'yyyy-MM-dd')
      // //////console.log(data['data'].date);
      // this.selectedDate = data.data.date;
    });
  }

  // getToday() {
  //   let today;
  //   let dd = new Date().getDate();
  //   let mm = new Date().getMonth() + 1;
  //   let yyyy = new Date().getFullYear();
  //   let hr = new Date().getHours();
  //   let min = new Date().getMinutes();
  //   let ss = new Date().getSeconds();
  //   let yy = (yyyy + '').substr(2, 2);

  //   today = yyyy + '-' + mm + '-' + dd + " " + hr + ":" + min + ":" + ss;
  //   this.todaydate = today
  //   // //////console.log(this.todaydate)
  // }

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

  async amountValue(protype) {
    const alert = await this.alertController.create({
      message: protype,
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
  //   date => //////console.log('Got date: ', date),
  //   err => //////console.log('Error occurred while getting date: ', err)
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
    // //////console.log(selectedtime);
    this.UNINV_DELIVERYTIMESLOT = this.selectedtime
  }

  alertCustomerType() {
    if (this.servicetype == "R & I" && (this.finalSubtotal < 30)) {
      this.amountValue('Minimum transaction amout for R & I is 160')
    } else {
      if (this.finalSubtotal < 30) {
        this.amountValue('Minimum transaction amout is 30')
      }
    }
  }

  addDiscount() {
    if (this.invoiceType == "Repeat" && this.finalSubtotal > 30 && this.company != "DC") {
      //create promotion object
      let params: any = {};
      this.storage.get('ACCOUNTS_TABLE').then(res => {
        // //////console.log(res)

        params.cat_type = "Promotion";
        params.description = "Chain Promotion";
        params.clean_type = "Promotion";
        params.ready_type = "Promotion"
        params.price = "-3"
        params.is_ready = "Yes"
        params.qty = "1"
        params.pieces = "0"

        this.promotionItem = params;
      })
      this.allinvoiceitems.push(params)
      this.finalSubtotal = (this.finalSubtotal * 1) - 3;
    }
    this.payableAmount = this.finalSubtotal;
    this.afterLessAmount = this.finalSubtotal;
    this.balanceAmount = this.finalSubtotal;
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
    // //////console.log(this.expressCharge)
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
    // //////console.log(this.paymentMethod)
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
      // //////console.log(this.payableAmount);
    } else if (this.percentPromo <= 0 || this.percentPromo == "") {
      this.afterLessAmount = this.finalSubtotal
      this.payableAmount = this.finalSubtotal
      // //////console.log(this.payableAmount);
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

  confirmAndCreateNew() {
    this.getToday()
    if (this.invoiceType == "New" && this.typeofSync == "New") {
      Promise.resolve(this.collectiondata()).then(coldata => {
        this.newInvoiceCollection = "true"
        this.canSyncNow = "true"
        this.proceedtoWherePage = "false"
        this.validationforsync = "false"
        this.savePay(coldata)
      })
    } else {
      Promise.resolve(this.collectiondata()).then(coldata => {
        this.newInvoiceCollection = "true"
        this.canSyncNow = "false"
        this.proceedtoWherePage = "false"
        this.validationforsync = "false"
        this.savePay(coldata)
      })
    }

  }


  confirmAndCreatePayment() { //KIV
    //generate new invoice
    if (this.finalSubtotal > 0) {
      if (this.invoiceType == "Repeat" && this.validationforsync == "false") {
        this.canSyncNow = "false"
        Promise.resolve(this.collectiondata()).then(coldata => {
          this.newInvoiceCollection = "true"
          this.proceedtoWherePage = "false"
          this.savePay(coldata)
        })
        // .finally(() => {
        //   this.proceedtoWhat("false");
        // })
        //update summary_table for repeat -- later part(KIV)
        // } else if (this.invoiceType == "Pending") {
        //update summary_table for pending -- later part(KIV
      } else {
        if (this.validationforsync == "true") {
          this.canSyncNow = "false"
          Promise.resolve(this.collectiondata()).then(coldata => {
            this.newInvoiceCollection = "true"
            this.proceedtoWherePage = "false"
            this.savePay(coldata)
          })
          // .finally(() => {
          //   this.proceedtoWhat("false");
          // })
        } else {
          this.canSyncNow = "false"
          Promise.resolve(this.collectiondata()).then(coldata => {
            this.newInvoiceCollection = "true"
            this.validationforsync == "false"
            this.proceedtoWherePage = "false"
            this.savePay(coldata)
          })
          // .finally(() => {
          //   this.proceedtoWhat("false");
          // })
        }
        //update summary_table for new and others -- later part(KIV)
      }
    } else if (this.finalSubtotal <= 0 && this.customerData.UNINV_INITIAL == "CC") {
      this.coldev("Final amout is zero please click back button to refresh the amount");
    } else if (this.finalSubtotal <= 0 && this.customerData.UNINV_INITIAL == "DC") {

      if (this.invoiceType == "Repeat" && this.validationforsync == "false") {
        this.canSyncNow = "false"
        Promise.resolve(this.collectiondata()).then(coldata => {
          this.newInvoiceCollection = "true"
          this.proceedtoWherePage = "false"
          this.savePay(coldata)
        })
        // .finally(() => {
        //   this.proceedtoWhat("false");
        // })
        //update summary_table for repeat -- later part(KIV)
        // } else if (this.invoiceType == "Pending") {
        //update summary_table for pending -- later part(KIV
      } else {
        if (this.validationforsync == "true") {
          this.canSyncNow = "false"
          Promise.resolve(this.collectiondata()).then(coldata => {
            this.newInvoiceCollection = "true"
            this.proceedtoWherePage = "false"
            this.savePay(coldata)
          })
          // .finally(() => {
          //   this.proceedtoWhat("false");
          // })
        } else {
          this.canSyncNow = "false"
          Promise.resolve(this.collectiondata()).then(coldata => {
            this.newInvoiceCollection = "true"
            this.validationforsync == "false"
            this.proceedtoWherePage = "false"
            this.savePay(coldata)
          })
          // .finally(() => {
          //   this.proceedtoWhat("false");
          // })
        }
        //update summary_table for new and others -- later part(KIV)
      }
    }

  }

  confirmPayment(pageto) {
    //console.log(this.invoiceType)
    //console.log(this.typeofSync)
    if (this.finalSubtotal > 0) {
      ////console.log(this.invoiceType)
      ////console.log(this.validationforsync)
      if (this.invoiceType == "Repeat" && this.typeofSync == "Repeat") {
        this.canSyncNow = "false"
        Promise.resolve(this.collectiondata()).then(coldata => {
          this.newInvoiceCollection = "false"
          this.validationforsync = "true"
          this.proceedtoWherePage = "true"
          this.savePay(coldata)
        })
        // .finally(() => {
        //   this.proceedtoWhat("true");
        // })
        //update summary_table for repeat -- later part(KIV)
        // } else if (this.invoiceType == "Pending") {
        //update summary_table for pending -- later part(KIV)

      } else if (this.invoiceType == "New" && this.typeofSync == "NewandAnother") {
        Promise.resolve(this.collectiondata()).then(coldata => {
          this.newInvoiceCollection = "false"
          this.validationforsync = "true"
          this.proceedtoWherePage = "true"
          this.canSyncNow = "false"
          this.savePay(coldata)
        })
      } else if (this.invoiceType == "New" && this.typeofSync == "New") {
        if (this.validationforsync == "true") {
          this.newInvoiceCollection = "false"
          this.validationforsync = "true"
          this.proceedtoWherePage = "true"
          this.canSyncNow = "true"
          this.syncPay()
        } else {
          this.canSyncNow = "false"
          Promise.resolve(this.collectiondata()).then(coldata => {
            this.newInvoiceCollection = "false"
            this.validationforsync = "true"
            this.proceedtoWherePage = "true"
            this.savePay(coldata)
          })
          // .finally(() => {
          //   ////console.log(this.validationforsync)
          //   this.proceedtoWhat("true");
          // })
        }
        //update summary_table for new and others -- later part(KIV)
      }
    } else if (this.finalSubtotal <= 0 && this.customerData.UNINV_INITIAL == "CC") {
      this.coldev("Final amout is zero please click back button to refresh the amount");
    } else if (this.finalSubtotal <= 0 && this.customerData.UNINV_INITIAL == "DC") {

      if (this.invoiceType == "Repeat" && this.typeofSync == "Repeat") {
        this.canSyncNow = "false"
        Promise.resolve(this.collectiondata()).then(coldata => {
          this.newInvoiceCollection = "false"
          this.validationforsync = "true"
          this.proceedtoWherePage = "true"
          this.savePay(coldata)
        })
        // .finally(() => {
        //   this.proceedtoWhat("true");
        // })
        //update summary_table for repeat -- later part(KIV)
        // } else if (this.invoiceType == "Pending") {
        //update summary_table for pending -- later part(KIV)

      } else if (this.invoiceType == "New" && this.typeofSync == "NewandAnother") {
        Promise.resolve(this.collectiondata()).then(coldata => {
          this.newInvoiceCollection = "false"
          this.validationforsync = "true"
          this.proceedtoWherePage = "true"
          this.canSyncNow = "false"
          this.savePay(coldata)
        })
      } else if (this.invoiceType == "New" && this.typeofSync == "New") {
        if (this.validationforsync == "true") {
          this.newInvoiceCollection = "false"
          this.validationforsync = "true"
          this.proceedtoWherePage = "true"
          this.canSyncNow = "true"
          this.syncPay()
        } else {
          this.canSyncNow = "false"
          Promise.resolve(this.collectiondata()).then(coldata => {
            this.newInvoiceCollection = "false"
            this.validationforsync = "true"
            this.proceedtoWherePage = "true"
            this.savePay(coldata)
          })
          // .finally(() => {
          //   ////console.log(this.validationforsync)
          //   this.proceedtoWhat("true");
          // })
        }
        //update summary_table for new and others -- later part(KIV)
      }
    }

    // if (navigator.onLine == true && this.invoiceType != 'Repeat') {
    //   if(myprocessofdata == 'proceedtopay'  && this.validationforsync == "true"){

    //   }else if(myprocessofdata == 'proceedtosave'){
    //     Promise.resolve(this.collectiondata()).then(coldata => {
    //       this.savePay(coldata)
    //     })
    //   }
    // } else {
    //   if(myprocessofdata == 'proceedtopay'){
    //     Promise.resolve(this.collectiondata()).then(coldata => {
    //       this.savePay(coldata)
    //     })
    //   }else if(myprocessofdata == 'proceedtosave'){
    //     Promise.resolve(this.collectiondata()).then(coldata => {
    //       this.savePay(coldata)
    //     })
    //   }else{
    //     Promise.resolve(this.collectiondata()).then(coldata => {
    //       this.savePay(coldata)
    //     })
    //   }

    // }

  }

  //no connection
  async savePay(offlinedata) {
    //////console.log(offlinedata)
    await this.presentLoading('Syncing local Data');
    ////update UNSYNCED_INVOICE_TABLE
    await this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      let data
      data = res
      let filtered: any = []

      if (data != null) {
        data.forEach(unsync => {
          if (this.invoiceType == "Repeat") {
            //////console.log("puampasok ba dito")
            //////console.log(offlinedata.savedon)
            //////console.log(unsync.UNINV_COLLTS)
            if (unsync.UNINV_COLLID == offlinedata.collectionid) {
              //////console.log("parang hindi")
              let params = {
                UNINV_AGREEDDELIVERYDATE: offlinedata.agreeddeliverydate,
                UNINV_BAGS: offlinedata.bags,
                UNINV_BALANCE: offlinedata.balancepaid,
                UNINV_COLLID: offlinedata.collectionid,
                UNINV_COLLTS: offlinedata.collectionid,
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
                colitem: offlinedata.invoiceitem,
                syncserver: this.canSyncNow,
                driversId: this.driversDetails.id,
                invoiceType: this.typeofSync,
                rateus : this.rateusdata
              }
              filtered.push(params)
            } else {
              filtered.push(unsync)
            }
          } else {
            if (unsync.UNINV_COLLID == offlinedata.collectionid) {
              let params = {
                UNINV_AGREEDDELIVERYDATE: offlinedata.agreeddeliverydate,
                UNINV_BAGS: offlinedata.bags,
                UNINV_BALANCE: offlinedata.balancepaid,
                UNINV_COLLID: offlinedata.collectionid,
                UNINV_COLLTS: offlinedata.collectionid,
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
                colitem: offlinedata.invoiceitem,
                syncserver: this.canSyncNow,
                driversId: this.driversDetails.id,
                invoiceType: this.typeofSync,
                rateus : this.rateusdata
              }
              filtered.push(params)
            } else {
              filtered.push(unsync)
            }
          }
        });
        //////console.log(filtered)
        this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
      } else {
        let params = {
          UNINV_AGREEDDELIVERYDATE: offlinedata.agreeddeliverydate,
          UNINV_BAGS: offlinedata.bags,
          UNINV_BALANCE: offlinedata.balancepaid,
          UNINV_COLLID: offlinedata.collectionid,
          UNINV_COLLTS: offlinedata.collectionid,
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
          colitem: offlinedata.invoiceitem,
          syncserver: this.canSyncNow,
          driversId: this.driversDetails.id,
          invoiceType: this.typeofSync,
          rateus : this.rateusdata
        }
        //////console.log(params)
        this.storage.set('UNSYNCED_INVOICE_TABLE', params)
      }

    }).finally(() => {
      this.storage.get('UNSYNCED_INVOICE_TABLE').then(ress => {
        //////console.log(ress)
      })
    })

    this.offlineCollectionUpdate(offlinedata);
  }

  offlineCollectionUpdate(offlinedata) {
    this.storage.get('COLDEL_TABLE').then(res => {
      let data, colid
      data = res
      let filtered: any = []

      colid = res.type == 'collection' ? res.findIndex(x => x.id == res.id) : res.findIndex(x => x.dei == res.dei)
      //////console.log(colid)

      if (data != "") {
        data.forEach(coldelData => {
          if (coldelData.coldel_type == 'collection') {
            if (coldelData.id == offlinedata.collectionid) {
              // let params = {
              //   id: coldelData.id,
              //   cui: coldelData.cui,
              //   aid: coldelData.aid,
              //   sts: coldelData.sts,
              //   cod: coldelData.cod,
              //   ren: coldelData.ren,
              //   cot: coldelData.cot,
              //   cun: coldelData.cun,
              //   cut: coldelData.cut,
              //   com: coldelData.com,
              //   na2: coldelData.na2,
              //   coa: coldelData.coa,
              //   cob: coldelData.cob,
              //   lil: coldelData.lil,
              //   cuo: coldelData.cuo,
              //   cue: coldelData.cue,
              //   rtd: coldelData.rtd,
              //   rtt: coldelData.rtt,
              //   uby: coldelData.uby,
              //   uon: coldelData.uon,
              //   cpc: coldelData.cpc,
              //   cn1: coldelData.cn1,
              //   cn2: coldelData.cn2,
              //   cn3: coldelData.cn3,
              //   cca: coldelData.cca,
              //   noe: coldelData.noe,
              //   con: coldelData.con,
              //   col: coldelData.col,
              //   pax: coldelData.pax,
              //   driver_id: coldelData.driver_id,
              //   name: coldelData.name,
              //   office_no: coldelData.office_no,
              //   mobile_no: coldelData.mobile_no,
              //   email_address: coldelData.email_address,
              //   coldel_type: coldelData.coldel_type,
              //   coldel_hang: coldelData.coldel_hang,
              //   coldel_pack: coldelData.coldel_pack,
              //   coldel_roll: coldelData.coldel_roll,
              //   coldel_return: coldelData.coldel_return,
              //   coldel_flag: "updated",
              // }
              // filtered.push(params)
            } else {
              filtered.push(coldelData)
            }
          } else {
            filtered.push(coldelData)
          }

          // if (coldelData.id == offlinedata.collectionid) {
          //   // this eill remove on local list
          // } else {
          //   filtered.push(coldelData)
          // }
        });
        this.storage.set('COLDEL_TABLE', filtered)
      }
    }).finally(() => {
      this.storage.get('COLDEL_TABLE').then(ress => {
        //////console.log(ress)
        this.proceedtoWhat(offlinedata)
      })
    })
  }

  proceedtoWhat(offlinedata) {
   //console.log(offlinedata)
    let proceedtowhere = this.validationforsync
   //console.log(proceedtowhere)
   //console.log(this.newInvoiceCollection)
    ////console.log(proceedtowhere)
    //console.log(proceedtowhere)

    if (proceedtowhere == "true" && this.newInvoiceCollection == "false") {
      this.storage.remove('TEMP_ITEMS_TABLE').then(() => {
        ////console.log('removed ');
        this.storage.remove('TEMP_RATES_TABLE').then(() => {
          ////console.log('removed ');
        }).then(() => {
          let params: any = {}
          params.invoicecompany = this.company
          params.invoicetype = this.invoiceType
          params.amount = offlinedata.depositamount
          params.paidtype =offlinedata.deposittype
          params.noofcol = 1
          params.nofodel = 0
          params.driversid = this.driversDetails.id
          params.date = this.todaydateonly
          params.invoiceno = offlinedata.invoiceno

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
                return (item.invoiceno.indexOf(offlinedata.invoiceno) !== -1)
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
        }).finally(() => {
          this.storage.get('DRIVER_SUMMARY').then(res => {
           //console.log(res)
          })
          this.defaultSrvc.getTempItems = undefined;
          this.customerData = ""
          this.loading.dismiss();
          this.router.navigate(['/coldev']);
        })
      })
    } else if (proceedtowhere == "false" && this.newInvoiceCollection == "true") {
      this.storage.remove('TEMP_ITEMS_TABLE').then(() => {
        ////console.log('removed ');
        this.storage.remove('TEMP_RATES_TABLE').then(() => {
          ////console.log('removed ');
        }).then(() => {
          let params: any = {}
          params.invoicecompany = this.company
          params.invoicetype = this.invoiceType
          params.amount = offlinedata.depositamount
          params.paidtype =offlinedata.deposittype
          params.noofcol = 1
          params.nofodel = 0
          params.driversid = this.driversDetails.id
          params.date = this.todaydateonly
          params.invoiceno = offlinedata.invoiceno

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
                return (item.invoiceno.indexOf(offlinedata.invoiceno) !== -1)
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
        }).finally(() => {
          this.defaultSrvc.getTempItems = undefined;
          this.customerData = ""
          this.loading.dismiss();
          this.createNewInvoiceFromLocal();
        })
      })

    }
  }

  //with connection
  async syncPay() {

    await Promise.resolve(this.collectiondata()).then(coldata => {
      ////console.log(coldata)

      if (navigator.onLine == true && this.canSyncNow == "true") {

        Promise.resolve(this.syncinvoiceSrvs.addinvoiceService(coldata)).then(data => {
          if (data != "false" && data != null && data != "duplicate") {
            this.presentAlert2("Invoice Successfully Sync")
            this.offlineCollectionUpdate(coldata);

          } else if (data == "duplicate") {
            this.presentAlert2("Duplicate Invoice")
            this.savePay(coldata);
          } else {
            this.presentAlert2("Cannot sync, poor internet connection. Please save later")
            this.savePay(coldata);
          }
        }).catch(e => {
          //////console.log(e);
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
      let params: any = {};
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

      // if (this.invoiceType == "Repeat") {
      //   this.invoiceId = "pending"
      // }

      this.storage.get('ENVNUM_TABLE').then(res => {
        var data = res
        //////console.log(data)
        let filtered: any = []
        if (data != null) {
          var l = res.length, i;
          for (i = 0; i < l; i++) {
            filtered.push(res[i])
          }
          filtered.push(this.newSeriesofInvoice);
        } else {
          filtered.push(this.newSeriesofInvoice);
        }
        this.storage.set('ENVNUM_TABLE', filtered)
      })
      // //////console.log(data);
        params.email = this.driver_email,
        params.password = this.driver_password,
        params.initial = this.company,
        params.customerid = this.customerID,
        params.collectionid = this.invoiceId,
        params.invoiceno = this.newSeriesofInvoice.INV_NO,
        params.type = this.invoiceTypeID,
        params.depositamount = this.depositAmount,
        params.deposittype = this.paymentMethod,
        params.balancepaid = "0.00",
        params.name = this.driver_name,
        params.agreeddeliverydate = this.UNINV_AGREEDDELIVERYDATE,
        params.deliverytimeslot = this.UNINV_DELIVERYTIMESLOT,
        params.invoiceitem = finalstring.toString(),
        params.invoicenote = finalstringNotes.toString(),
        params.hasdonate = this.UNINV_DONATE,
        params.donatetotal = this.UNINV_DONATE,
        params.discount = this.percentPromo,
        params.express = this.expressData,
        params.bags = this.UNINV_BAGS,
        params.savedon = this.todaydate,
        params.driversId = this.driversDetails.id,
        params.invoiceType = this.typeofSync,
        params.rateus = this.rateusdata
      resolve(params)
    }).catch(e => {
      //////console.log(e);
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
    let sss = ss < 10 ? "0" + ss : ss

    today = yyyy + '-' + mmm + '-' + ddd + " " + hhr + ":" + mmin + ":" + sss;
    this.todaydate = today
    this.todaydateonly = yyyy + '-' + mmm + '-' + ddd

    this.mySpecialIDCol = today
    return today
    // ////console.log(this.todaydate)
  }

  async createNewInvoiceFromLocal() {
 
    ////console.log(this.dataForCreateNewCollection)
   ////console.log(this.newInvoiceCollection)
    let tag;
    const alert = await this.alertController.create({
      header: 'Bill from which company?',
      message: 'For curtains, carpets and sofa covers, please bill from DC. For any others, please bill from CC.',
      cssClass: 'ion-alertCSS',
      backdropDismiss: false,
      buttons: [
        {
          text: 'DC',
          handler: async () => {
            await this.presentLoading('Creating new Invoice');
            //function herer
            // ////console.log(this.selected);
            tag = "DC"
            // this.defaultSrvc.createInvSeries(tag)
            // this.router.navigate(['/selectcategory', this.collectionInfo]);
            // Promise.resolve(this.defaultSrvc.createInvSeries(tag, this.collectionId)).then(data => {
            //   ////console.log(data);
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialIDCol
            params.UNINV_COLLID = this.mySpecialIDCol
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = this.dataForCreateNewCollection.cui
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = 'New'
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
            params.driversId = this.driversDetails.id
            params.invoicesynctype = 'NewandAnother'
            params.rateus = this.rateusdata
            ////console.log(params)

            this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              ////console.log(this.unsyncData)

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
            }).then(() => {
              // ////console.log(this.unsyncData);
              let params: any = {}
              if (this.isCollection == "true") {
                this.checkIfRepeat = "no";

                params.rid = this.mySpecialIDCol
                params.coldelID = this.mySpecialIDCol
                params.custID = this.dataForCreateNewCollection.cui
                params.accID = this.dataForCreateNewCollection.com
                params.credit = ""
                params.invoiceno = ""
                params.invoicetype = "New"
                params.invcompany = tag

                params.UCOtimestamp = "UCOtimestamp" //new UCO will be generated in the collection loop if necessary
                params.UCOcusttype = this.dataForCreateNewCollection.cut //30-11-2012 for checking minimum
                params.UCOcollecttype = this.dataForCreateNewCollection.col
                params.UCOcollectdate = this.defaultSrvc.getToday()
                params.UCOcollecttime = this.dataForCreateNewCollection.cot
                params.UCOcollectaddress = this.dataForCreateNewCollection.coa
                params.UCOcollectunit = this.dataForCreateNewCollection.cuo
                params.UCOcollectpostal = this.dataForCreateNewCollection.cpc
                params.UCOcollectbuilding = this.dataForCreateNewCollection.cob
                params.UCOcollectregion = this.dataForCreateNewCollection.ren
                params.UCOcollectnote = ""
                params.UCOcollectstatus = "collected"
                params.UCOreturndate = "0000-00-00"
                params.UCOreturntime = "A 10 - 12pm"
                params.done = "A 10 - 12pm"
                params.syncserver = "false"
                params.driversId = this.driversDetails.id
                params.invoicesynctype = 'NewandAnother'
                params.rateus = this.rateusdata
              } else {

                this.checkIfRepeat = "yes";

                params.rid = this.mySpecialIDCol
                params.coldelID = this.mySpecialIDCol
                params.custID = this.dataForCreateNewCollection.cui
                params.accID = this.dataForCreateNewCollection.com
                params.credit = ""
                params.invoiceno = ""
                params.invoicetype = "New"
                params.invcompany = tag

                params.UCOtimestamp = "UCOtimestamp" //new UCO will be generated in the collection loop if necessary
                params.UCOcusttype = this.dataForCreateNewCollection.cut //30-11-2012 for checking minimum
                params.UCOcollecttype = this.dataForCreateNewCollection.del
                params.UCOcollectdate = this.defaultSrvc.getToday()
                params.UCOcollecttime = this.dataForCreateNewCollection.det
                params.UCOcollectaddress = this.dataForCreateNewCollection.dea
                params.UCOcollectunit = this.dataForCreateNewCollection.dun
                params.UCOcollectpostal = this.dataForCreateNewCollection.dpc
                params.UCOcollectbuilding = this.dataForCreateNewCollection.deb
                params.UCOcollectregion = this.dataForCreateNewCollection.ren
                params.UCOcollectnote = ""
                params.UCOcollectstatus = "collected"
                params.UCOreturndate = "0000-00-00"
                params.UCOreturntime = "A 10 - 12pm"
                params.done = "A 10 - 12pm"
                params.syncserver = "false"
                params.driversId = this.driversDetails.id
                params.invoicesynctype = 'NewandAnother'
                params.rateus = this.rateusdata
              }


              // this.storage.set('UNSYNCOLLECTIONLOCAL', params).then(datas =>{
              this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
                this.unsyncDataCollection = res
                // ////console.log(this.unsyncData)

                if (res == null) {
                  this.unsyncDataCollection = []
                  this.unsyncDataCollection.push(params)
                  this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                  // ////console.log(this.unsyncData)

                } else {
                  let result;
                  result = this.unsyncDataCollection.filter((item) => {
                    return (item.rid.indexOf(params.rid) !== -1)
                  })
                  if (result.length < 1) {
                    this.unsyncDataCollection.push(params)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    // ////console.log(this.unsyncData)

                  } else {
                    // ////console.log(result)
                    let i;
                    i = this.unsyncDataCollection.findIndex(x => x.id == result[0].id)
                    this.unsyncDataCollection.splice(i, 1, params);
                    // ////console.log(this.unsyncData)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                  }
                }
              }).finally(() => {
              
                if (this.isCollection == "true") {
                  // this.storage.get('SELECTED_ITEM').then(res => {
                  //   let data, colid
                  //   data = res
                  //   let filtered: any = []
                  //  //console.log(this.invoiceId)
                  //  //console.log(data.id)
                  //   // if (data != "") {
                  //     // data.forEach(coldelData => {
                  //       if (data.id == this.invoiceId) {
                  //         let params = {
                  //           id: this.mySpecialIDCol,
                  //           cui: data.cui,
                  //           aid: data.aid,
                  //           sts: data.sts,
                  //           cod: data.cod,
                  //           ren: data.ren,
                  //           cot: data.cot,
                  //           cun: data.cun,
                  //           cut: data.cut,
                  //           com: data.com,
                  //           na2: data.na2,
                  //           coa: data.coa,
                  //           cob: data.cob,
                  //           lil: data.lil,
                  //           cuo: data.cuo,
                  //           cue: data.cue,
                  //           rtd: data.rtd,
                  //           rtt: data.rtt,
                  //           uby: data.uby,
                  //           uon: data.uon,
                  //           cpc: data.cpc,
                  //           cn1: data.cn1,
                  //           cn2: data.cn2,
                  //           cn3: data.cn3,
                  //           cca: data.cca,
                  //           noe: data.noe,
                  //           con: data.con,
                  //           col: data.col,
                  //           pax: data.pax,
                  //           driver_id: data.driver_id,
                  //           name: data.name,
                  //           office_no: data.office_no,
                  //           mobile_no: data.mobile_no,
                  //           email_address: data.email_address,
                  //           coldel_type: data.coldel_type,
                  //           coldel_hang: data.coldel_hang,
                  //           coldel_pack: data.coldel_pack,
                  //           coldel_roll: data.coldel_roll,
                  //           coldel_return: data.coldel_return,
                  //           coldel_flag: "updated",
                  //         }
                          this.dataForCreateNewCollection.id = this.mySpecialIDCol
                          this.storage.set('SELECTED_ITEM', this.dataForCreateNewCollection)
                          this.loading.dismiss();
                          this.router.navigate(['/selectcategory', this.dataForCreateNewCollection]);
                        // }
                      // })

                    // }
                  // })

                } else {
                  // this.storage.get('SELECTED_ITEM').then(res => {
                  //   let data, colid
                  //   data = res
                  //   let filtered: any = []
                  //  //console.log(this.invoiceId)
                  //  //console.log(data.dei)
                  //   // if (data != "") {
                  //     // data.forEach(coldelData => {
                  //       if (data.dei == this.invoiceId) {
                  //         let params = {
                  //           dei: this.mySpecialIDCol,
                  //           aid: data.aid,
                  //           cui: data.cui,
                  //           sts: data.sts,
                  //           ded: data.ded,
                  //           ren: data.ren,
                  //           det: data.det,
                  //           cun: data.cun,
                  //           cut: data.cut,
                  //           com: data.com,
                  //           na2: data.na2,
                  //           dea: data.dea,
                  //           deb: data.deb,
                  //           lil: data.lil,
                  //           dun: data.dun,
                  //           cue: data.cue,
                  //           uby: data.uby,
                  //           uon: data.uon,
                  //           dpc: data.dpc,
                  //           cn1: data.cn1,
                  //           cn2: data.cn2,
                  //           cn3: data.cn3,
                  //           noe: data.noe,
                  //           den: data.den,
                  //           han: data.han,
                  //           pac: data.pac,
                  //           rol: data.rol,
                  //           ret: data.ret,
                  //           del: data.del,
                  //           pax: data.pax,
                  //           id: data.id,
                  //           inn: data.inn,
                  //           coi: data.coi,
                  //           toa: data.toa,
                  //           dis: data.dis,
                  //           dpt: data.dpt,
                  //           dpa: data.dpa,
                  //           delivery_driver_id: data.delivery_driver_id,
                  //           delivery_driver: data.delivery_driver,
                  //           cca: data.cca,
                  //           exp: data.exp,
                  //           baa: data.baa,
                  //           bap: data.bap,
                  //           invn: data.invn,
                  //           accu: data.accu,
                  //           coldel_type: data.coldel_type,
                  //           coldel_returndate: data.coldel_returndate,
                  //           coldel_returntime: data.coldel_returntime,
                  //           coldel_flag: "updated"
                  //         }
                          this.dataForCreateNewCollection.dei = this.mySpecialIDCol
                          this.storage.set('SELECTED_ITEM', this.dataForCreateNewCollection)
                          this.loading.dismiss();
                          this.router.navigate(['/selectcategory', this.dataForCreateNewCollection]);
                      //  }
                      // })

                    // }
                 // })
                }
              })
            })
            // })

            // }).catch(e => {
            //   ////console.log(e);
            // });
          }
        }, {
          text: 'CC',
          handler: async () => {
            await this.presentLoading('Creating new Invoice');
            tag = "CC"
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialIDCol
            params.UNINV_COLLID = this.mySpecialIDCol
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = this.dataForCreateNewCollection.cui
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = 'New'
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
            params.driversId = this.driversDetails.id
            params.invoicesynctype = 'NewandAnother'
            params.rateus = this.rateusdata
            ////console.log(params)


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
            }).then(() => {
              // ////console.log(this.unsyncData);
              // this.defaultSrvc.getTempItems = null

              let params: any = {}
              if (this.isCollection == "true") {
                this.checkIfRepeat = "no";


                params.rid = this.mySpecialIDCol
                params.coldelID = this.mySpecialIDCol
                params.custID = this.dataForCreateNewCollection.cui
                params.accID = this.dataForCreateNewCollection.com
                params.credit = ""
                params.invoiceno = ""
                params.invoicetype = "New"
                params.invcompany = tag

                params.UCOtimestamp = "UCOtimestamp" //new UCO will be generated in the collection loop if necessary
                params.UCOcusttype = this.dataForCreateNewCollection.cut //30-11-2012 for checking minimum
                params.UCOcollecttype = this.dataForCreateNewCollection.col
                params.UCOcollectdate = this.defaultSrvc.getToday()
                params.UCOcollecttime = this.dataForCreateNewCollection.cot
                params.UCOcollectaddress = this.dataForCreateNewCollection.coa
                params.UCOcollectunit = this.dataForCreateNewCollection.cuo
                params.UCOcollectpostal = this.dataForCreateNewCollection.cpc
                params.UCOcollectbuilding = this.dataForCreateNewCollection.cob
                params.UCOcollectregion = this.dataForCreateNewCollection.ren
                params.UCOcollectnote = ""
                params.UCOcollectstatus = "collected"
                params.UCOreturndate = "0000-00-00"
                params.UCOreturntime = "A 10 - 12pm"
                params.done = "A 10 - 12pm"
                params.syncserver = "false"
                params.driversId = this.driversDetails.id
                params.invoicesynctype = 'NewandAnother'
                params.rateus = this.rateusdata
              } else {
                this.checkIfRepeat = "yes";

                params.rid = this.mySpecialIDCol
                params.coldelID = this.mySpecialIDCol
                params.custID = this.dataForCreateNewCollection.cui
                params.accID = this.dataForCreateNewCollection.com
                params.credit = ""
                params.invoiceno = ""
                params.invoicetype = "New"
                params.invcompany = tag

                params.UCOtimestamp = "UCOtimestamp" //new UCO will be generated in the collection loop if necessary
                params.UCOcusttype = this.dataForCreateNewCollection.cut //30-11-2012 for checking minimum
                params.UCOcollecttype = this.dataForCreateNewCollection.del
                params.UCOcollectdate = this.defaultSrvc.getToday()
                params.UCOcollecttime = this.dataForCreateNewCollection.det
                params.UCOcollectaddress = this.dataForCreateNewCollection.dea
                params.UCOcollectunit = this.dataForCreateNewCollection.dun
                params.UCOcollectpostal = this.dataForCreateNewCollection.dpc
                params.UCOcollectbuilding = this.dataForCreateNewCollection.deb
                params.UCOcollectregion = this.dataForCreateNewCollection.ren
                params.UCOcollectnote = ""
                params.UCOcollectstatus = "collected"
                params.UCOreturndate = "0000-00-00"
                params.UCOreturntime = "A 10 - 12pm"
                params.done = "A 10 - 12pm"
                params.syncserver = "false"
                params.driversId = this.driversDetails.id
                params.invoicesynctype = 'NewandAnother'
                params.rateus = this.rateusdata
              }

              // this.storage.set('UNSYNCOLLECTIONLOCAL', params).then(data =>{
              this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
                this.unsyncDataCollection = res
                // ////console.log(this.unsyncData)

                if (res == null) {
                  this.unsyncDataCollection = []
                  this.unsyncDataCollection.push(params)
                  this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                  // ////console.log(this.unsyncData)

                } else {
                  let result;
                  result = this.unsyncDataCollection.filter((item) => {
                    return (item.rid.indexOf(params.rid) !== -1)
                  })
                  if (result.length < 1) {
                    this.unsyncDataCollection.push(params)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    // ////console.log(this.unsyncData)

                  } else {
                    // ////console.log(result)
                    let i;
                    i = this.unsyncDataCollection.findIndex(x => x.id == result[0].id)
                    this.unsyncDataCollection.splice(i, 1, params);
                    // ////console.log(this.unsyncData)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                  }
                }
              }).finally(() => {
                
                if (this.isCollection == "true") {
                  // this.storage.get('SELECTED_ITEM').then(res => {
                  //   let data, colid
                  //   data = res
                  //   //let filtered: any = []
                  //  //console.log(this.invoiceId)
                  //  //console.log(data.id)
                  //   // if (data != "") {
                  //     // data.forEach(coldelData => {
                  //       if (data.id == this.invoiceId) {
                  //         let params = {
                  //           id: this.mySpecialIDCol,
                  //           cui: data.cui,
                  //           aid: data.aid,
                  //           sts: data.sts,
                  //           cod: data.cod,
                  //           ren: data.ren,
                  //           cot: data.cot,
                  //           cun: data.cun,
                  //           cut: data.cut,
                  //           com: data.com,
                  //           na2: data.na2,
                  //           coa: data.coa,
                  //           cob: data.cob,
                  //           lil: data.lil,
                  //           cuo: data.cuo,
                  //           cue: data.cue,
                  //           rtd: data.rtd,
                  //           rtt: data.rtt,
                  //           uby: data.uby,
                  //           uon: data.uon,
                  //           cpc: data.cpc,
                  //           cn1: data.cn1,
                  //           cn2: data.cn2,
                  //           cn3: data.cn3,
                  //           cca: data.cca,
                  //           noe: data.noe,
                  //           con: data.con,
                  //           col: data.col,
                  //           pax: data.pax,
                  //           driver_id: data.driver_id,
                  //           name: data.name,
                  //           office_no: data.office_no,
                  //           mobile_no: data.mobile_no,
                  //           email_address: data.email_address,
                  //           coldel_type: data.coldel_type,
                  //           coldel_hang: data.coldel_hang,
                  //           coldel_pack: data.coldel_pack,
                  //           coldel_roll: data.coldel_roll,
                  //           coldel_return: data.coldel_return,
                  //           coldel_flag: "updated",
                  //         }
                          //filtered.push(params)
                          this.dataForCreateNewCollection.id = this.mySpecialIDCol
                          this.storage.set('SELECTED_ITEM', this.dataForCreateNewCollection)
                          this.loading.dismiss();
                          this.router.navigate(['/selectcategory', this.dataForCreateNewCollection]);
                        //}
                      // })
     
                    // }
                 // })
                } else {
                  // this.storage.get('SELECTED_ITEM').then(res => {
                  //   let data, colid
                  //   data = res
                  //   //let filtered: any = []
                  //  //console.log(this.invoiceId)
                  //  //console.log(data.dei)
                  //   // if (data != "") {
                  //    // data.forEach(coldelData => {
                  //       if (data.dei == this.invoiceId) {
                  //         let params = {
                  //           dei: this.mySpecialIDCol,
                  //           aid: data.aid,
                  //           cui: data.cui,
                  //           sts: data.sts,
                  //           ded: data.ded,
                  //           ren: data.ren,
                  //           det: data.det,
                  //           cun: data.cun,
                  //           cut: data.cut,
                  //           com: data.com,
                  //           na2: data.na2,
                  //           dea: data.dea,
                  //           deb: data.deb,
                  //           lil: data.lil,
                  //           dun: data.dun,
                  //           cue: data.cue,
                  //           uby: data.uby,
                  //           uon: data.uon,
                  //           dpc: data.dpc,
                  //           cn1: data.cn1,
                  //           cn2: data.cn2,
                  //           cn3: data.cn3,
                  //           noe: data.noe,
                  //           den: data.den,
                  //           han: data.han,
                  //           pac: data.pac,
                  //           rol: data.rol,
                  //           ret: data.ret,
                  //           del: data.del,
                  //           pax: data.pax,
                  //           id: data.id,
                  //           inn: data.inn,
                  //           coi: data.coi,
                  //           toa: data.toa,
                  //           dis: data.dis,
                  //           dpt: data.dpt,
                  //           dpa: data.dpa,
                  //           delivery_driver_id: data.delivery_driver_id,
                  //           delivery_driver: data.delivery_driver,
                  //           cca: data.cca,
                  //           exp: data.exp,
                  //           baa: data.baa,
                  //           bap: data.bap,
                  //           invn: data.invn,
                  //           accu: data.accu,
                  //           coldel_type: data.coldel_type,
                  //           coldel_returndate: data.coldel_returndate,
                  //           coldel_returntime: data.coldel_returntime,
                  //           coldel_flag: "updated"
                  //         }
                          //filtered.push(params)
                          this.dataForCreateNewCollection.dei = this.mySpecialIDCol
                          this.storage.set('SELECTED_ITEM', this.dataForCreateNewCollection)
                          this.loading.dismiss();
                          this.router.navigate(['/selectcategory', this.dataForCreateNewCollection]);
                        //}
                      //})

                    // }
                 // })
                }
              })
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

  async coldev(msg) {
    const alert = await this.alertController.create({
      header: '',
      message: msg,
      cssClass: 'ion-alertCSS',
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }




}