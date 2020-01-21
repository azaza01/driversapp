import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, ModalController} from '@ionic/angular';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';


@Component({
  selector: 'app-driversummary',
  templateUrl: './driversummary.page.html',
  styleUrls: ['./driversummary.page.scss'],
})
export class DriversummaryPage implements OnInit {

  loading: any = new LoadingController;
  summarydata: any = []

  datePickerObj: any = {};

  mysummary: any

  selectedInvoice: any
  showSum: any = "true"
  letShow: any =  "false"

  invoicecompanyCC: number = 0
  invoicecompanyDC: number = 0
  invoicetypeNew: number = 0
  invoicetypeRepeat: number = 0
  noofCollection: number = 0
  noofDeliveries: number = 0

  invoiceCash: number = 0
  invoiceBT: number = 0
  invoiceCredit: number = 0
  invoiceCheque: number = 0

  invoiceCashAmt: number = 0
  invoiceBTAmt: number = 0
  invoiceCreditAmt: number = 0
  invoiceChequeAmt: number = 0

  totalAmount: number = 0

  todaydateonly: any

  dcAmount: number = 0
  ccAmount: number = 0

  driversDetails: any 
  
  constructor(
    private storage: Storage,
    public loadingCtrl: LoadingController,
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

  async ngOnInit() {
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      // //////console.log(res)
      this.driversDetails = res
    })
    this.getToday();
    this.getSummary(this.todaydateonly)
  }

  getToday() {
    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();

    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm

    this.todaydateonly = yyyy + '-' + mmm + '-' + ddd
    // ////console.log(this.todaydate)
  }

  
  getSummary(mydate){
    console.log(mydate)
    this.storage.get('DRIVER_SUMMARY').then(res => {
      console.log(res);
      res == null ? this.mysummary = [] : this.mysummary = res
      this.mysummary.forEach(myC => {

        let today;
        let dd = new Date(myC.date).getDate();
        let mm = new Date(myC.date).getMonth() + 1;
        let yyyy = new Date(myC.date).getFullYear();
  
        let ddd = dd < 10 ? "0" + dd : dd
        let mmm = mm < 10 ? "0" + mm : mm

        today = yyyy + '-' + mmm + '-' + ddd

        if(myC.invoicecompany == "DC" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.invoicecompanyDC = this.invoicecompanyDC  + 1
          this.dcAmount =  (this.dcAmount  *  1) + (myC.amount * 1)
        }else if(myC.invoicecompany == "CC" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.invoicecompanyCC = this.invoicecompanyCC + 1
          this.ccAmount =  (this.ccAmount  *  1) + (myC.amount * 1)
        }

        if(myC.invoicetype == "New" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.invoicetypeNew = this.invoicetypeNew  + 1
        }else if(myC.invoicetype == "Repeat" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.invoicetypeRepeat = this.invoicetypeRepeat + 1
        }

        if(myC.invoicetype == "Delivery" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.noofDeliveries = this.noofDeliveries  + 1
        }else if(myC.invoicetype != "Delivery" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.noofCollection = this.noofCollection + 1
        }

        if(myC.paidtype == "Credit" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.invoiceCredit = this.invoiceCredit  + 1
          this.invoiceCreditAmt = (this.invoiceCreditAmt *  1)  + (myC.amount * 1)
        }else if(myC.paidtype == "BT" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.invoiceBT = this.invoiceBT + 1
          this.invoiceBTAmt = (this.invoiceBTAmt *  1)  + (myC.amount * 1)
        }else if(myC.paidtype == "Cash" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.invoiceCash = this.invoiceCash + 1
          this.invoiceCashAmt = (this.invoiceCashAmt *  1)  + (myC.amount * 1)
        }else if(myC.paidtype == "Cheque" && (today == mydate && myC.driversid == this.driversDetails.id)){
          this.invoiceCheque = this.invoiceCheque + 1
          this.invoiceChequeAmt = (this.invoiceChequeAmt *  1)  + (myC.amount * 1)
        }

        if(today == mydate && myC.driversid == this.driversDetails.id){
          this.totalAmount = (this.totalAmount * 1)  + (myC.amount * 1)
        }
        console.log(myC.invoicecompany)
      });

      this.totalAmount = Math.round((this.totalAmount) * 100) / 100;
      this.invoiceCashAmt = Math.round((this.invoiceCashAmt) * 100) / 100;
      this.invoiceChequeAmt = Math.round((this.invoiceChequeAmt) * 100) / 100;
      this.invoiceBTAmt = Math.round((this.invoiceBTAmt) * 100) / 100;
      this.invoiceCreditAmt = Math.round((this.invoiceCreditAmt) * 100) / 100;
      this.ccAmount = Math.round((this.ccAmount) * 100) / 100;
      this.dcAmount = Math.round((this.dcAmount) * 100) / 100;

    
  
    })
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
      console.log(data.data.date)

      this.mysummary = ""
      this.invoicecompanyCC= 0
      this.invoicecompanyDC= 0
      this.invoicetypeNew= 0
      this.invoicetypeRepeat= 0
      this.noofCollection= 0
      this.noofDeliveries= 0
    
      this.invoiceCash= 0
      this.invoiceBT= 0
      this.invoiceCredit= 0
      this.invoiceCheque= 0
    
      this.invoiceCashAmt= 0
      this.invoiceBTAmt= 0
      this.invoiceCreditAmt= 0
      this.invoiceChequeAmt= 0
    
      this.totalAmount = 0
      this.dcAmount = 0
      this.ccAmount = 0

      let today;
      let myselectedDate = data.data.date
      let dd = new Date(myselectedDate).getDate();
      let mm = new Date(myselectedDate).getMonth() + 1;
      let yyyy = new Date(myselectedDate).getFullYear();
  
      let ddd = dd < 10 ? "0" + dd : dd
      let mmm = mm < 10 ? "0" + mm : mm
  
      today = yyyy + '-' + mmm + '-' + ddd

      this.todaydateonly = today

      this.getSummary(today)
      // //////console.log(data['data'].date);
      // this.selectedDate = data.data.date;
    });
  }

  closeMe(){
    this.selectedInvoice = []
    this.storage.remove('SELECTED_INVOICES')
    this.showSum = "true"
    this.letShow = "false"
  }

  viewInvoice(){
    this.showSum = "false"
    this.letShow = "true"

    this.storage.get('DRIVER_SUMMARY').then(res => {
      console.log(res);      
      let filtered: any = []
      res == null ? this.mysummary = [] : this.mysummary = res
      this.mysummary.forEach(myC => {
        let today;
        let dd = new Date(myC.date).getDate();
        let mm = new Date(myC.date).getMonth() + 1;
        let yyyy = new Date(myC.date).getFullYear();
        let ddd = dd < 10 ? "0" + dd : dd
        let mmm = mm < 10 ? "0" + mm : mm
        today = yyyy + '-' + mmm + '-' + ddd

        if (today == this.todaydateonly && myC.driversid == this.driversDetails.id) {
          filtered.push(myC)
        } 
      });

      this.storage.set('SELECTED_INVOICES', filtered)
    }).finally(() =>{
      this.storage.get('SELECTED_INVOICES').then(res => {
        this.selectedInvoice = res
        console.log(res)
      })
    })
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  // colNum = (TextView)findViewById(R.id.DS_collectionnum_tv);
  //       delNum = (TextView)findViewById(R.id.DS_deliverynum_tv);
  //       repeatNum = (TextView)findViewById(R.id.DS_repeatnum_tv);
  //       tripNum = (TextView)findViewById(R.id.DS_tripnum_tv);
  //       cash = (TextView)findViewById(R.id.DS_cashamount_tv);
  //       cheque = (TextView)findViewById(R.id.DS_chequeamount_tv);
  //       credit = (TextView)findViewById(R.id.DS_creditamount_tv);
  //       banktransfer = (TextView)findViewById(R.id.DS_banktransferamount_tv);
  //       ccamount = (TextView)findViewById(R.id.DS_ccamount_tv);
  //       dcamount = (TextView)findViewById(R.id.DS_dcamount_tv);
  //       totalamount = (TextView)findViewById(R.id.DS_totalamount_tv);
  //       summarydate = (TextView)findViewById(R.id.DS_summarydate_tv);

}
