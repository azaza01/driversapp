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

  deliveryStatus: any
  deliveryDetails: any
  isLoading: boolean = false

  email_address: any
  password: any 
  name: any

  todaydate: any

  constructor(
    public alertController: AlertController,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public syncdelivery: SyncdeliveryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getPaymentDetails()
    this.getToday() 
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      console.log(res)
      this.email_address = res.email_address
      this.password = res.password
      this.name = res.name
    })
  }

  getPay(payAmount) {
    this.payAmount = payAmount
    if(this.payAmount == undefined){
      this.payAmount = 0
    }
    console.log(payAmount)
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

  async makePayment(){
    this.getdeliveryStatus();
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

  makePaymentAndCreateNew(){
    this.getdeliveryStatus();

    // update COLDEL_TABLE

    // update SUMMARY_TABLE

    // UNSYNCED_PAYMENT_TABLE


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

  async deliverysync(){
    let params = {
      email : this.email_address,
      password : this.password,
      delid : this.deliveryDetails.dei, //pass coldelID (actually is delID) and ws gets the invid
      nowpaid : this.payAmount, // must add the Last Paid field together
      lastpaid : this.deliveryDetails.bap, // should have a field that sends back the previous payment to add up the last deposit with last paid so this current payment can be tracked in settlement
      balancepaid : this.deliveryDetails.dpa , // must add the Last Paid field together because we are updating the balance paid field
      balancetype : this.deliveryDetails.dpt,
      status : this.deliveryStatus,
      ppdate : this.deliveryDetails.ded, //06-05-2013
      pptimeslot : this.deliveryDetails.det, //06-05-2013
      name : this.name,
      savedon : this.todaydate
     }
     console.log(params)

     await this.presentLoading('');
     Promise.resolve(this.syncdelivery.syncdeliverysrvc(params)).then(data => {
       console.log(data);
       if (data) {
        console.log(data)
         this.presentToast("Delivery Successfully Sync")
        //  this.router.navigate(['/home']);
       } else {
         this.presentToast("Cannot sync, please save later")
         this.saveLocalPayment();
        //  this.router.navigate(['/home']);
         
       }
       this.loading.dismiss();
 
     }).catch(e => {
       console.log(e);
     });
    
  }

  async getdeliveryStatus() {
    const alert = await this.alertController.create({
      header: 'Delivery Status',
      message: "Please choose below",
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'Full Delivered',
          handler: () => {
            this.deliveryStatus = "Full Delivered"
            this.getDeliveryPaymentStatus();
          }
        }, {
          text: 'Partial Delivered',
          handler: () => {
            this.deliveryStatus = "Partial Delivered"
            this.getDeliveryPaymentStatus();
          }
        }
      ]
    });

    await alert.present();
  }

  getDeliveryPaymentStatus() {
    console.log(this.deliveryDetails.bap);
    console.log(this.deliveryDetails.dpa);
    console.log(this.payAmount);
    var newamount = parseFloat(this.deliveryDetails.bap + this.deliveryDetails.dpa)  + (this.payAmount);
    console.log(newamount);
    if (newamount >= this.outstandingbalance) {
      //Log.d("spark", "paid amount is smaller than existing credits");
      //status = status + ", Full Paid";
      //if credit amount is less than the amount to pay, mark as partial paid
        if ((this.deliveryDetails.cca  < this.outstandingbalance) && (this.paymentMethod == "CREDIT")) { //outstandingPaid is > than creditsBalance 2015-01-13
          this.deliveryStatus  =  this.deliveryStatus  + ", Partial Paid"
          this.deliverysync();
        }else {
          this.deliveryStatus=  this.deliveryStatus + ", Full Paid";
          this.deliverysync();
        }
    }else if (this.outstandingbalance  == 0) {
      this.deliveryStatus  =  this.deliveryStatus + ", Unpaid";
      this.deliverysync();
    }else {
      this.deliveryStatus  =  this.deliveryStatus + ", Partial Paid";
      this.deliverysync();
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
