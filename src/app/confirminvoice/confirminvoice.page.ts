import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';

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
  percentPromoAmount: any;
  percentPromo: any;

  invoiceSyncLink : any;
  
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

  customercredit:any ;
  paymentMethod:any = "CASH";

  constructor(
    public alertController: AlertController,
    private defaultSrvc: DefaultsService,
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
      this.invoiceType = this.customerData.UNINV_TYPE
      console.log(this.invoiceId);
      this.alertCustomerType();
    })

    this.storage.get('COLDEL_TABLE').then(res => {
      console.log(res)
      var l = res.length, i;
      for( i=0; i<l; i++) {
          if(res[i].id == this.invoiceId){
            this.returnDate  = res[i].coldel_return;
            this.customercredit = res[i].cca;
            this.customerTypes = res[i].cut;
          }               
      }
      console.log(this.returnDate)
      console.log(this.customercredit)
      console.log(this.customerTypes)
    })

    this.storage.get('COLDEL_TABLE').then(res => {
      var l = res.length, i;
      for( i=0; i<l; i++) {
          if(res[i].id == this.invoiceId){
            this.returnDate  = res[i].coldel_return;
          }               
      }
      console.log(this.returnDate)
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
        if(this.finalSubtotal > 30){
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
        if(this.finalSubtotal > 30){
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
      message: "minimum for " + this.customerTypes + " is $30!" ,
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

  showFinal(finalSubtotal){
    this.finalSubtotal =  finalSubtotal
  }
  
  alertCustomerType(){
    if (this.customerTypes == "HDB" && (this.payableAmount < 30)) {
      this.amountValue()
    }else if (this.customerTypes == "Condo" && (this.payableAmount < 30)) {
      this.amountValue()
    }else if (this.customerTypes == "Landed" && (this.payableAmount < 30)) {
       this.amountValue()
    }else {
      
    }
  }

  addDiscount(){
    if (this.invoiceType == "Repeat" && (this.finalSubtotal  > 30) && (this.company != "DC")) {
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
      this.afterLessAmount = this.finalSubtotal -3;
      this.balanceAmount = this.finalSubtotal - 3;
    }
  }
 
 

  lessPromotion(percentPromo) {
    if(percentPromo > 100){
      this.presentAlert();
      this.percentPromo = "";
    }else{
      // this.percentValue = percentPromo;
      this.getTotalPayable();
    }
  }

  getexpressAmount(expressCharge) {
    this.expressCharge  = expressCharge
    console.log(this.expressCharge)
    this.getTotalPayable();
  }

  getDeposit(depositAmount) {
    this.depositAmount = depositAmount;
    this.getTotalPayable();
  }

  getPayemntMethod(paymentMethod){
    this.paymentMethod = paymentMethod
    console.log(this.paymentMethod)
  }

  // overDueAmount(overDue){
  //   this.overDue = overDue;
  //   this.getTotalPayable();
  // }

  getTotalPayable(){
    if(this.percentPromo > 0){
      this.convertedPercent = (this.percentPromo / 1000) * 10
      this.percentPromoAmount = this.finalSubtotal * this.convertedPercent
      this.afterLessAmount = this.finalSubtotal - this.percentPromoAmount
      this.payableAmount = this.afterLessAmount 
      console.log(this.payableAmount);
    }else if(this.percentPromo <= 0 || this.percentPromo == "" ){
      this.afterLessAmount = this.finalSubtotal
      this.payableAmount = this.finalSubtotal
      console.log(this.payableAmount);
    }

    if (this.expressCharge != "None" && this.expressCharge != ""  && this.expressCharge != 0 ) {
      this.expressPercent = (this.expressCharge / 1000) * 10

      if (this.afterLessAmount != null || this.afterLessAmount != 0) {
        this.expressAmount = this.afterLessAmount * this.expressPercent
        this.payableAmount = this.afterLessAmount + this.expressAmount
      } else {
        this.payableAmount = this.afterLessAmount
      }
    }

    if(this.depositAmount == "" ||this.depositAmount == undefined ){
      this.balanceAmount = this.payableAmount
    }else{
      this.balanceAmount = this.payableAmount - this.depositAmount
    }
    
  }


  confirmAndCreatePayment() {

    //generate new invoice

    if(this.invoiceType == "Repeat"){
      //update summary_table for repeat -- later part(KIV)
    }else if(this.invoiceType == "Pending"){
      //update summary_table for pending -- later part(KIV)
    }else{
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

  confirmPayment() {

    if(this.paymentMethod == "CREDIT" && this.payableAmount <= this.customercredit){
      //update credit credit of customer
      //check overdue payment and add to total payable - later part(KIV)
      this.payAction()
    }else{
      this.payAction()
    }

  }


  payAction(){
    if(this.invoiceType == "Repeat"){
      //update summary_table for repeat -- later part(KIV)
    }else if(this.invoiceType == "Pending"){
      //update summary_table for pending -- later part(KIV)
    }else{
      //update summary_table for new and others -- later part(KIV)
    }

    ////check connection
    //if(true){
      this.syncPay()
    //}else{
      this.savePay()
    //}

  }


  //no connection
  savePay(){
          ////update UNSYNCED_INVOICE_TABLE

         // UNINV_COLLTS = UCOtimestamp //use old timestamp because this is an update not insert new
		      // UNINV_COLLID = this.invoiceId
	        // UNINV_CUSTID = custID
		      // UNINV_INVNO = invoice_number
		      // UNINV_INITIAL = this.company
	        // UNINV_TYPE  = this.invoiceType
	        // UNINV_DEPOAMT =  this.depositAmount
	        // UNINV_DEPOTYPE = this.paymentMethod
	        // UNINV_BALANCE = this.balanceAmount
	        // UNINV_AGREEDDELIVERYDATE = agreed deliver date
	        // UNINV_DELIVERYTIMESLOT = agreed deliver time
	        // UNINV_INVOICENOTE =  getnote
	        // UNINV_DISCOUNT = this.percentPromoAmount
	        // UNINV_EXPRESS =  this.expressPercent
	        // UNINV_HASDONATE = getdonate
	        // UNINV_DONATE = getdonate
	        // UNINV_BAGS = getbags
          // UNINV_SAVEDON = UCOtimestamp

          //update as collected from pending
          
          ////go to main menu
  }

  //with connection
  syncPay(){

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
    // "type", invoicetypeID)); 

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
      this.savePay();
    //}

 
  }

}
