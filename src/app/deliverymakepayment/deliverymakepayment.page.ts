import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-deliverymakepayment',
  templateUrl: './deliverymakepayment.page.html',
  styleUrls: ['./deliverymakepayment.page.scss'],
})
export class DeliverymakepaymentPage implements OnInit {

  paymentMethod: any
  payAmount: any

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


  constructor(
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.getPaymentDetails()
  }

  getPay(payAmount){
    this.payAmount = payAmount
    console.log(payAmount)
  }

  getPayemntMethod(paymentMethod){
    this.paymentMethod = paymentMethod
    console.log(this.paymentMethod)
  }

  getPaymentDetails(){
      // this.invnum = "inn" 
			// this.totalamount = "toa"
			// this.billFromCompany = "coi"
		 	// this.discounts = "dis"
			// this.depositamount = "dpa"
			// this.deposittype = "dpt"
      // this.LastPaid = "bap"
      // this.outstandingbalance = this.totalamount - (this.depositamount  + this.LastPaid )
      // this.customerCredit = "100"

      this.invnum = "inn" 
			this.totalamount = 108
			this.billFromCompany = "CC"
		 	this.discounts = 20
			this.depositamount = 60
			this.deposittype = "CASH"
      this.LastPaid = 40
      this.outstandingbalance = this.totalamount - (this.depositamount  + this.LastPaid )
      this.customerCredit = "100"
  }

  saveSummury(){
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

  saveLocalPayment(){
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

  makePayment(){
    this.deliveryStatus();
    // update summary table SUMMARY_TABLE +1 to deliver add value to (CASH or CREDIT, CHEQUE, BT  +1 to DC/CC)

    if ((this.LastPaid + this.depositamount + this.depositamount) ==  this.totalamount) {
      //Log.d("spark", "paid amount is smaller than existing credits");
        //status = status + ", Full Paid";
      //if credit amount is less than the amount to pay, mark as partial paid
        if ((this.outstandingbalance <= 0) && (this.paymentMethod == "CREDIT")) { //outstandingPaid is > than creditsBalance 2015-01-13
          this.deliveryStatus  =  this.deliveryStatus  + ", Partial Paid"
        }
        else {
          this.deliveryStatus=  this.deliveryStatus + ", Full Paid";
        }
    }
    else if (this.outstandingbalance  == 0) {
      this.deliveryStatus  =  this.deliveryStatus + ", Unpaid";
    }
    else {
      this.deliveryStatus  =  this.deliveryStatus + ", Partial Paid";
    }

    //parametes
        // "email", prefEmail));
        // "password", prefPassword));
        // "delid", coldelID)); //pass coldelID (actually is delID) and ws gets the invid
        // "nowpaid", et.getText().toString())); // must add the Last Paid field together
        // "lastpaid", String.valueOf(lastPaid))); // should have a field that sends back the previous payment to add up the last deposit with last paid so this current payment can be tracked in settlement
        // "balancepaid", String.valueOf(balancePaid))); // must add the Last Paid field together because we are updating the balance paid field
        // "balancetype", bt.getText().toString()));
        // "status", status));
        // "ppdate", ppDate)); //06-05-2013
        // "pptimeslot", ppTimeslot)); //06-05-2013
        // "name", prefUserName));
        // "savedon", savedon)); //time of save from driver


  // link = http://ccmanager.cottoncare.com.sg/ws/updateinvoicestatus.json



  }

  makePaymentAndCreateNew(){
    this.deliveryStatus();
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
          }
        }, {
          text: 'Partial Delivered',
          handler: () => {
            this.deliveryStatus = "Partial Delivered"
          }
        }
      ]
    });

    await alert.present();
  }

}
