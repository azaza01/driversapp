import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { Network } from '@ionic-native/network/ngx';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';

@Component({
  selector: 'app-confirminvoice',
  templateUrl: './confirminvoice.page.html',
  styleUrls: ['./confirminvoice.page.scss'],
})
export class ConfirminvoicePage implements OnInit {

  customerData: any
  isLoading: boolean = false

  checkAccount = 0;
  company: any;

  invoiceId: any;
  invoiceType: any;
  promotionItem: any;


  finalSubtotal: any = 0;
  percentPromo: any
  percentPromoAmount: any;
  invoiceSyncLink: any;

  // percentValue: any;
  convertedPercent: any;
  afterLessAmount: any;
  expressAmount: any;
  expressPercent: any;
  payableAmount: any;
  expressCharge: any = "None";
  depositAmount: any;
  balanceAmount: any;
  returnDate: any;
  customerTypes: any;

  overDue: any;

  customercredit: any;
  paymentMethod: any = "CASH";

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
    this.isLoading = true
    this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      console.log(res)
      this.customerData = res[0]
      this.isLoading = false
      this.invoiceId = this.customerData.UNINV_COLLID;
      this.company = this.customerData.UNINV_INITIAL
      this.invoiceType = this.customerData.UNINV_TYPE
      this.selectedtime = this.customerData.UNINV_DELIVERYTIMESLOT
      const initDeliveryDate = this.customerData.UNINV_AGREEDDELIVERYDATE
      this.initDELIVERYDATE = initDeliveryDate
      console.log(this.invoiceId);
      this.alertCustomerType();
    })

    this.storage.get('SELECTED_ITEM').then(res => {
      console.log(res)
      this.returnDate = res.coldel_return;
      this.customercredit = res.cca;
      this.customerTypes = res.cut;
      console.log(this.returnDate)
      console.log(this.customercredit)
      console.log(this.customerTypes)
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
      console.log(this.timeslots)
      this.isLoading = false
    })


    this.getItemSubtotal();
  }

  getItemSubtotal() {
    if (this.checkAccount == 1) {
      this.storage.get("TEMP_RATES_TABLE").then(res => {
        var flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (res[i].rid == this.invoiceId && res[i].qty != 0) {
            this.finalSubtotal = res[i].subtotal;
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
        console.log(res)

        var flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (res[i].rid == this.invoiceId && res[i].qty != 0) {
            console.log(res[i])

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
        params.item_ready = "Yes"
        params.price = "0"
        params.qty = "1"
        params.pcs = "0"
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
    console.log(this.expressCharge)
    this.getTotalPayable();
  }

  getDeposit(depositAmount) {
    this.depositAmount = depositAmount;
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
      this.percentPromoAmount = this.finalSubtotal * this.convertedPercent
      this.afterLessAmount = this.finalSubtotal - this.percentPromoAmount
      this.payableAmount = this.afterLessAmount
      console.log(this.payableAmount);
    } else if (this.percentPromo <= 0 || this.percentPromo == "") {
      this.afterLessAmount = this.finalSubtotal
      this.payableAmount = this.finalSubtotal
      console.log(this.payableAmount);
    }

    if (this.expressCharge != "None" && this.expressCharge != "" && this.expressCharge != 0) {
      this.expressPercent = (this.expressCharge / 1000) * 10

      if (this.afterLessAmount != null || this.afterLessAmount != 0) {
        this.expressAmount = this.afterLessAmount * this.expressPercent
        this.payableAmount = this.afterLessAmount + this.expressAmount
      } else {
        this.payableAmount = this.afterLessAmount
      }
    }

    if (this.depositAmount == "" || this.depositAmount == undefined) {
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

    if (paymentMethod == "CREDIT" && this.payableAmount <= this.customercredit) {
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
      this.syncPay()
    } else {
      this.savePay()
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
    // newCustomerData.UNINV_DELIVERYTIMESLOT = agreed deliver time
    // newCustomerData.UNINV_INVOICENOTE =  getnote
    this.customerData.UNINV_DISCOUNT = this.percentPromoAmount
    this.customerData.UNINV_EXPRESS = this.expressPercent
    // newCustomerData.UNINV_HASDONATE = getdonate
    // this.customerData.UNINV_DONATE = this.customerData.UNINV_DONATE
    // this.customerData.UNINV_BAGS = this.customerData.UNINV_BAGS
    this.customerData.UNINV_SAVEDON = new Date() + ''

    console.log(this.customerData)

    //update as collected from pending

    ////go to main menu
  }

  //with connection
  syncPay() {
    console.log(navigator.onLine)
    this.invoiceSyncLink = "http://ccmanager.cottoncare.com.sg/ws/addinvoice.json"

    // //update overdue payment  - later part(KIV)

    // //get all items as array
    // //parameters below

    // "email" = driver email
    // "password" = driver password
    // "initial"  = this.company
    // "customerid" =  custID
    // "collectionid" = this.invoiceId
    // "invoiceno" = invoice_number

    // ////check type and get corresponding id number
    // "type", invoicetypeID

    // ///// subtract overdue amount from deposit else won't tally  - later part(KIV)
    // ///// BigDecimal depood = new BigDecimal(deposit.getText().toString()); - later part(KIV)
    // ///// BigDecimal odamt = new BigDecimal(overdueTV.getText().toString());
    // ///// BigDecimal depoonly = depood.subtract(odamt); - later part(KIV)

    // "depositamount" = this.depositAmount
    // "deposittype"  = this.paymentMethod
    // "balancepaid" = "0.00"  //saved but useless
    // "name" = driver name
    // "agreeddeliverydate" = agreed deliver date
    // "deliverytimeslot" = agreed deliver time
    // "invoiceitem" = items; //all items
    // "invoicenote" = getnote //have to format into array else will have error
    // "hasdonate" = getdonate
    // "donatetotal" = getdonate
    // "discount" = this.percentPromoAmount
    // "express" = this.expressPercent
    // "bags" = getbags
    // "savedon" = UCOtimestamp


    //// get "collection", selectedDate, coldelID) to delete on local table if successful
    //if (successful{
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

}
