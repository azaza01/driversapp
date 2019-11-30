import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

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


  finalSubtotal: any = 0;
  percentPromoAmount: any;
  convertedPercent: any;
  afterLessAmount: any;
  expressAmount: any;
  expressPercent: any;
  payableAmount: any;
  expressCharge: any;
  depositAmount: any;
  balanceAmount: any;
  returnDate: any;
  customercredit:any ;

  constructor(
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.isLoading = true
    this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      console.log(res)
      this.customerData = res[0]
      this.isLoading = false
      this.invoiceId = this.customerData.UNINV_COLLID;
      this.company = this.customerData.UNINV_INITIAL
      console.log(this.invoiceId);
    })

    this.storage.get('COLDEL_TABLE').then(res => {
      console.log(res)
      var l = res.length, i;
      for( i=0; i<l; i++) {
          if(res[i].id == this.invoiceId){
            this.returnDate  = res[i].coldel_return;
            this.customercredit = res[i].cca;
          }               
      }
      console.log(this.returnDate)
      console.log(this.customercredit)
    })

    this.getItemSubtotal();
  }

  showFinal(finalSubtotal){
    this.finalSubtotal =  finalSubtotal
  }

  lessPromotion(percentPromo) {
    this.convertedPercent = (percentPromo / 1000) * 10
    this.percentPromoAmount = this.finalSubtotal * this.convertedPercent
    this.afterLessAmount = this.finalSubtotal - this.percentPromoAmount
    this.getexpressAmount(this.expressCharge);
  }

  getexpressAmount(expressCharge) {
    this.payableAmount = 0;
    if (this.expressCharge != "None") {
      this.expressPercent = (expressCharge / 1000) * 10
    }

    if (this.afterLessAmount != null || this.afterLessAmount != 0) {
      this.expressAmount = this.afterLessAmount * this.expressPercent
      this.payableAmount = this.afterLessAmount + this.expressAmount
    } else {
      this.payableAmount = this.afterLessAmount
    }
    console.log(this.payableAmount)
  }

  getDeposit(depositAmount) {
    this.balanceAmount = this.payableAmount - depositAmount
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
      })
    }

  }

  makePayment() {

  }

  viewItems() {

  }

}
