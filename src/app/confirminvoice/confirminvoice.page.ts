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
UNINV_INVOICENOTE: any = {}
UNINV_SAVEDON: any
UNINV_TYPE: any

allinvoiceitems: any = []
itemsArray: any = []
itemObject: any = {}

invoiceNotesArray: any = []
invoiceNotesObject: any = {}

  overDue: any;
  todaydate : any;

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
    public syncinvoice: SyncinvoiceService,
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

      this.company = this.customerData.UNINV_INITIAL
      this.invoiceType = this.customerData.UNINV_TYPE
      this.customerID = this.customerData.UNINV_CUSTID
      this.selectedtime = this.customerData.UNINV_DELIVERYTIMESLOT
      this.invoiceNumber = this.customerData.UNINV_INVNO
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
      this.UNINV_INVOICENOTE = this.customerData.UNINV_INVOICENOTE
      this.UNINV_SAVEDON = this.customerData.UNINV_SAVEDON
      this.UNINV_TYPE = this.customerData.UNINV_TYPE

      console.log(this.customerData);


      this.storage.get('INVOICE_TYPES_TABLE').then(res => {
      console.log(res)
      var  l = res.length, i;
        for (i = 0; i < l; i++) {
          if (res[i].description == this.invoiceType){
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
              "cat_type" : res[i].cat_type,
							"description" : res[i].description,
							"clean_type" : res[i].clean_type,
							"ready_type" : res[i].ready_type,
							"price" : parseFloat(res[i].price),
							"is_ready" : res[i].is_ready,
							"qty" : parseFloat(res[i].qty),
							"pieces" : parseFloat(res[i].pieces)
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
              "cat_type" : res[i].cat_type,
							"description" : res[i].description,
							"clean_type" : res[i].clean_type,
							"ready_type" : res[i].ready_type,
							"price" : parseFloat(res[i].price),
							"is_ready" : res[i].is_ready,
							"qty" : parseFloat(res[i].qty),
							"pieces" : parseFloat(res[i].pieces)
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
      this.percentPromo = "";
    } else {
      // this.percentValue = percentPromo;
      this.getTotalPayable();
    }
  }

  getexpressAmount(expressCharge) {
    this.expressCharge = expressCharge
    if(this.expressCharge == "None"){
      this.expressData = "1.00"
    }else if(this.expressCharge == "50"){
      this.expressData = "1.50"
    }else  if(this.expressCharge == "100"){
      this.expressData = "2.00"
    }
    console.log(this.expressCharge)
    this.getTotalPayable();
  }

  getDeposit(depositAmount) {
    this.depositAmount = depositAmount;
    if(this.depositAmount == undefined){
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
    }else if(this.expressCharge == "None"){
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

    this.savePay()

    //// collection generated in local UNSYNCED_COLLECTION_TABLE
    //initialValues.put(UNCOLL_RELATED_UNSYNCED_ID, unsynccol.getUCOUIID());
    //initialValues.put(UNCOLL_CUSTID, unsynccol.getUCOCustId());
    //initialValues.put(UNCOLL_CUSTTYPE, unsynccol.getUCOcusttype());
    //initialValues.put(UNCOLL_COLLECTTYPE, unsynccol.getUCOcollecttype());
    //initialValues.put(UNCOLL_COLLECTDATE, unsynccol.getUCOcollectdate());
    //initialValues.put(UNCOLL_COLLECTTIME, unsynccol.getUCOcollecttime());
    //initialValues.put(UNCOLL_COLLECTADDRESS, unsynccol.getUCOcollectaddress());
    //initialValues.put(UNCOLL_COLLECTUNIT, unsynccol.getUCOcollectunit());
    //initialValues.put(UNCOLL_COLLECTPOSTAL, unsynccol.getUCOcollectpostal());
    //initialValues.put(UNCOLL_COLLECTBUILDING, unsynccol.getUCOcollectbuilding());
    //initialValues.put(UNCOLL_COLLECTREGION, unsynccol.getUCOcollectregion());
    //initialValues.put(UNCOLL_COLLECTNOTE, unsynccol.getUCOcollectnote());
    //initialValues.put(UNCOLL_COLLECTSTATUS, unsynccol.getUCOcollectstatus());
    //initialValues.put(UNCOLL_UPDATEBY, unsynccol.getUCOcreatedby());

  }

  confirmPayment(paymentMethod) {
    console.log(paymentMethod)
    console.log(this.customercredit)
    console.log(this.payableAmount)

    if (paymentMethod == "Credit" && this.payableAmount <= this.customercredit) {
      //update credit credit of customer
      this.updateCredit()
      //check overdue payment and add to total payable - later part(KIV)
      this.payAction()
    } else {
      this.payAction()
    }

  }

  updateCredit() {

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
      this.savePay()
    } else {
      this.syncPay()
    }

  }


  //no connection
  savePay() {
    console.log(navigator.onLine)
    ////update UNSYNCED_INVOICE_TABLE
    console.log(this.customerData)

    // newCustomerData.UNINV_COLLTS = UCOtimestamp //use old timestamp because this is an update not insert new
    // this.customerData.UNINV_COLLID = this.invoiceId
    // newCustomerData.UNINV_CUSTID = custID
    // newCustomerData.UNINV_INVNO = invoice_number
    // this.customerData.UNINV_INITIAL = this.company
    // newCustomerData.UNINV_TYPE  = this.invoiceType
    this.customerData.UNINV_DEPOAMT = this.depositAmount
    this.customerData.UNINV_DEPOTYPE = this.paymentMethod
    this.customerData.UNINV_BALANCE = this.balanceAmount
    this.customerData.UNINV_AGREEDDELIVERYDATE = this.customerData.UNINV_AGREEDDELIVERYDATE == '0000-00-00' ? this.datepipe.transform(new Date(this.getDay(7)), 'yyyy-MM-dd') : this.customerData.UNINV_AGREEDDELIVERYDATE
    this.customerData.UNINV_DELIVERYTIMESLOT = this.UNINV_DELIVERYTIMESLOT
    this.customerData.UNINV_INVOICENOTE = this.UNINV_INVOICENOTE
    this.customerData.UNINV_DISCOUNT = this.percentPromoAmount
    this.customerData.UNINV_EXPRESS = this.expressPercent
    this.customerData.UNINV_HASDONATE = this.UNINV_HASDONATE
    this.customerData.UNINV_DONATE = this.UNINV_DONATE
    this.customerData.UNINV_BAGS = this.UNINV_BAGS
    this.customerData.UNINV_SAVEDON = new Date() + ''

    console.log(this.customerData)

    //update as collected from pending COLDEV_TABLE

    ////go to main menu
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

  //with connection
async syncPay() {
    console.log(navigator.onLine)
    // //update overdue payment  - later part(KIV)
    // //get all items as array

    if(this.UNINV_INVOICENOTE == undefined || this.UNINV_INVOICENOTE == null){
      this.invoiceNotesObject = '[{"name":"' + this.UNINV_INVOICENOTE + '"}]';
      this.invoiceNotes =  this.invoiceNotesArray.push(this.invoiceNotesArray)
    }else{
      var json = '[{"name":""}]';
      this.invoiceNotes = json;
    }

    // string validation of items
    var myObj = JSON.stringify(this.allinvoiceitems);
    var myStringRep = JSON.stringify(myObj);
    var removeQuote = myStringRep.replace("\"[{", "{[");
    var finalstring = removeQuote.replace("}]\"", "]}");
    console.log(finalstring)

    // string validation of it
    var mystringnotes = JSON.stringify(this.invoiceNotes);
    var removeNotesQuote = mystringnotes.replace("\"[{", "{[");
    var finalstringNotes = removeNotesQuote.replace("}]\"", "]}");
    console.log(finalstringNotes)


  let params: any  = {}
  params.email = this.driver_email,
  params.password = this.driver_password,
  params.initial = this.company,
  params.customerid = this.customerID,
  params.collectionid = this.invoiceId,
  params.invoiceno =  this.invoiceNumber  //this.invoiceNumber,
  // ////check type and get corresponding id number
  params.type = this.invoiceTypeID, 
  params.depositamount = this.depositAmount,
  params.deposittype = this.paymentMethod,
  params.balancepaid =  "0.00"   //saved but useless
  params.name = this.driver_name,
  params.agreeddeliverydate = this.UNINV_AGREEDDELIVERYDATE,
  params.deliverytimeslot = this.UNINV_DELIVERYTIMESLOT,
  params.invoiceitem = finalstring.toString(),//all items this.items = JSON.stringify(this.result);
  params.invoicenote = finalstringNotes.toString(), //have to format into array else will have error
  params.hasdonate = this.UNINV_DONATE,
  params.donatetotal = this.UNINV_DONATE, //saved but useless
  params.discount = this.percentPromoAmount,
  params.express = this.expressData,
  params.bags = this.UNINV_BAGS,
  params.savedon = this.todaydate

  console.log(params)
    await this.presentLoading('');
    Promise.resolve(this.syncinvoice.syncInvoice(params)).then(data => {
      console.log(data);
      if (data) {
        this.presentToast("Sync Successful")
        this.router.navigate(['/home']);
      } else {
        this.presentToast("Cannot sync")
        //this.savePay();
      }
      this.loading.dismiss();

    }).catch(e => {
      console.log(e);
    });

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


}


// {
//   "agreeddeliverydate": "2019-12-04",
//   "bags": "1",
//   "balancepaid": "0.00",
//   "collectionid": "141699",
//   "customerid": "27915",
//   "deliverytimeslot": "I Day Time",
//   "depositamount": "42",
//   "deposittype": "CASH",
//   "discount": "3.0500000000000003",
//   "donatetotal": "10",
//   "email": "davidchia@cottoncare.com.sg",
//   "express": "0.5",
//   "hasdonate": "10",
//   "initial": "CC",
//   "invoiceitem": [
//     {
//       "cat_type": "Clothing",
//       "clean_type": "Laundry",
//       "description": "Blouse (Ladies)",
//       "id": "1",
//       "item_ready": "no",
//       "pcs": "1",
//       "price": "5.50",
//       "qty": "2",
//       "ready_type": "Hang",
//       "rid": "141699",
//       "subtotal": "11",
//       "updated_by": "admin",
//       "updated_on": "0000-00-00 00:00:00"
//     },
//     {
//       "cat_type": "Clothing",
//       "clean_type": "Dry Clean",
//       "description": "Blouse (Ladies)",
//       "id": "2",
//       "item_ready": "no",
//       "pcs": "1",
//       "price": "6.50",
//       "qty": "3",
//       "ready_type": "Hang",
//       "rid": "141699",
//       "subtotal": "19.5",
//       "updated_by": "admin",
//       "updated_on": "0000-00-00 00:00:00"
//     }
//   ],
//   "invoiceno": "CC-19129Ch01",
//   "invoicenote": "asadsa",
//   "name": "Chia",
//   "password": "585ae7c2bcd0b7409c9be2edc4b117e22a51b33d",
//   "savedon": "Sat Dec 07 2019 15:43:33 GMT+0800 (Philippine Standard Time)",
//   "type": "New"
// }

// agreeddeliverydate:2019-12-04
// bags:1
// balancepaid:0.00
// collectionid:141699
// customerid:27915
// deliverytimeslot:I Day Time
// depositamount:42
// deposittype:CASH
// discount:3.0500000000000003
// donatetotal:10
// email:davidchia@cottoncare.com.sg
// express:0.5
// hasdonate:10
// initial:CC
// invoiceno:CC-19129Ch0
// invoicenote:yuyuy
// name:Chia
// password:585ae7c2bcd0b7409c9be2edc4b117e22a51b33d
// savedon:Sat Dec 07 2019 15:43:33 GMT+0800 (Philippine Standard Time)
// type:New
// invoiceitem:[↵    {↵      "cat_type": "Clothing",↵      "clean_type": "Laundry",↵      "description": "Blouse (Ladies)",↵      "id": "1",↵      "item_ready": "no",↵      "pcs": "1",↵      "price": "5.50",↵      "qty": "2",↵      "ready_type": "Hang",↵      "rid": "141699",↵      "subtotal": "11",↵      "updated_by": "admin",↵      "updated_on": "0000-00-00 00:00:00"↵    },↵    {↵      "cat_type": "Clothing",↵      "clean_type": "Dry Clean",↵      "description": "Blouse (Ladies)",↵      "id": "2",↵      "item_ready": "no",↵      "pcs": "1",↵      "price": "6.50",↵      "qty": "3",↵      "ready_type": "Hang",↵      "rid": "141699",↵      "subtotal": "19.5",↵      "updated_by": "admin",↵      "updated_on": "0000-00-00 00:00:00"↵    }↵  ]