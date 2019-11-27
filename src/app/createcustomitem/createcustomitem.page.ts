import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ThrowStmt } from '@angular/compiler';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-createcustomitem',
  templateUrl: './createcustomitem.page.html',
  styleUrls: ['./createcustomitem.page.scss'],
})
export class CreatecustomitemPage implements OnInit {

  company: any; //sample
  checkAccount = 0;
  priceTables: any;
  informat:any ;
  mycompany:any ;


  //getData
  generatedCategories: any = []
  selectedCategory: any = []
  generatedSofa: any = []
  selectedsofa: any 
  selectedCurtainService: any 
  selectedCleantype: any
  selectedreadyTypes: any 
  cleantypetwo: any
  carpettype: any
  unittype: any = "cm"
  pricetype: any 


  //pricing variable
  carpetlaundryprice: any
  carpetdrycleanprice: any
  carpetshaggyprice: any
  carpetTwosidedprice: any
  curtainlaundrypricestr: any
  curtaindrycleanpricestr: any 
  curtainremovalpricestr: any

  //labelprice variable
  pricepersqf: any
  getpricetype: any
  breadthdata: any = 0
  convertedbreadthdata: any
  lengths: any = 0
  subtotal: any = 0
  myprice: any = 0
  myquan: any = 0
  noOfPcs: any = 0

  //other data
  normaldesc: any
  curtaindesc: any
  newdescription: any

  //for description of curtain
  dayCurtain: any
  nightCurtain: any
  blackoutCurtain: any
  belt: any
  others: any
  totalItemsCurtain: any
  concatDescripton: any

 //sofa pricing 
SofaCoverLDS: any
SofaCoverDCS: any
SofaCoverLDD: any
SofaCoverDCD: any
SofaCoverLDT: any
SofaCoverDCT: any
SofaCoverLDL: any
SofaCoverDCL: any
CushionCoverDCS: any
CushionCoverLDS: any
CushionCoverLDM: any
CushionoverDCM: any
CushionCoverLDL: any
CushionCoverDCL: any

SofaSelectedPrice: any


  constructor(private storage: Storage, public alertController: AlertController,) { }

  ngOnInit() {
    this.getItem();
    this.getItemPrices();
    this.getSofaPrices();
  }

  clearCalcu(){
    this.lengths = 0;
    this.subtotal  = 0;
    this.myprice = 0;
    this.myquan = 0;
    this.noOfPcs = 0;
    this.breadthdata = 0;
  }

  showSelectValue(selectedCat){
    this.selectedCategory = selectedCat;
    console.log(this.selectedCategory);
    this.clearCalcu();
    if(this.selectedCategory == "Sofa Covers"){
      this.getSofaList();
    }
  }
  
  showSelectedSofa(selectedsofa){
    this.selectedsofa = selectedsofa;
    console.log(this.selectedsofa);
    if(this.selectedsofa == "Sofa Cover (S)" &&  this.selectedCleantype == "LD"){
      this.SofaSelectedPrice = this.SofaCoverLDS;
      console.log(this.SofaSelectedPrice);
    }else if(this.selectedsofa == "Sofa Cover (S)" &&  this.selectedCleantype == "DC"){
      this.SofaSelectedPrice = this.SofaCoverDCS;
    }else if(this.selectedsofa == "Sofa Cover (D)" &&  this.selectedCleantype == "LD"){
      this.SofaSelectedPrice = this.SofaCoverLDD;
    }else if(this.selectedsofa == "Sofa Cover (D)" &&  this.selectedCleantype == "DC"){
      this.SofaSelectedPrice = this.SofaCoverDCD;
    }else if(this.selectedsofa == "Sofa Cover (T)" &&  this.selectedCleantype == "LD"){
      this.SofaSelectedPrice = this.SofaCoverLDT;
    }else if(this.selectedsofa== "Sofa Cover (T)" &&  this.selectedCleantype == "DC"){
      this.SofaSelectedPrice = this.SofaCoverDCT;
    }else if(this.selectedsofa == "Sofa Cover (L)" &&  this.selectedCleantype == "LD"){
      this.SofaSelectedPrice = this.SofaCoverLDL;
    }else if(this.selectedsofa == "Sofa Cover (L)" &&  this.selectedCleantype == "DC"){
      this.SofaSelectedPrice = this.SofaCoverDCL;
    }else if(this.selectedsofa == "Cushion Cover (S)" &&  this.selectedCleantype == "LD"){
      this.SofaSelectedPrice = this.CushionCoverLDS;
    }else if(this.selectedsofa== "Cushion Cover (S)" &&  this.selectedCleantype == "DC"){
      this.SofaSelectedPrice = this.CushionCoverDCS;
    }else if(this.selectedsofa == "Cushion Cover (M)" &&  this.selectedCleantype == "LD"){
      this.SofaSelectedPrice = this.CushionCoverLDM;
    }else if(this.selectedsofa == "Cushion Cover (M)" &&  this.selectedCleantype == "DC"){
      this.SofaSelectedPrice = this.CushionoverDCM;
    }else if(this.selectedsofa == "Cushion Cover (L)"&&  this.selectedCleantype == "LD"){
      this.SofaSelectedPrice = this.CushionCoverLDL;
    }else if(this.selectedsofa == "Cushion Cover (L)" &&  this.selectedCleantype == "DC"){
      this.SofaSelectedPrice = this.CushionCoverDCL;
    }  
    
  }

  selectedCleantypes(cleantypes){
    this.selectedCleantype = cleantypes;
    console.log(this.selectedCleantype);

  }

  cleantypes2(cleantype2){
    this.cleantypetwo = cleantype2;
    this.changeCurtainsCost();
  }

  readyTypes(readyType){
    this.selectedreadyTypes = readyType;
  }

  checkCurtainService(curtainService){
    this.selectedCurtainService = curtainService
    this.changeCurtainsCost();
    this.curtainDesc();
  }


  carpettypes(carpettype){
    this.carpettype = carpettype;
    if (this.carpettype == "Short") {
      this.pricepersqf = this.carpetlaundryprice;
      console.log(this.pricepersqf);
    }
    else if (this.carpettype == "Shaggy") {
      this.pricepersqf = this.carpetshaggyprice;
      console.log(this.pricepersqf);
    }
    else if (this.carpettype == "Twosided") {
      this.pricepersqf = this.carpetTwosidedprice;
      console.log(this.pricepersqf);
    }
    this.calculateCarpetCost();
  }

  unittypes(unittype){
    this.unittype = unittype;
    this.calculateCarpetCost();
  }

  getLength(lengths){
    this.lengths = lengths;
    this.calculateCarpetCost();
  }

  getBreadth(breadthdata){
    this.breadthdata = breadthdata;
    this.calculateCarpetCost();
  }

  getNormalDesc(normaldesc){
    this.normaldesc = normaldesc;
  }

  getCurtainDesc(curtaindesc){
    this.curtaindesc = curtaindesc;
  }

  getPrice(myprice){
    this.myprice = myprice;
    this.calculateCarpetCost();
  }
  getQuan(myquan){
    this.myquan = myquan;
    this.calculateCarpetCost();
  }
  getSubtotal(subtotal){
    this.subtotal = subtotal;
  }

  getdayCurtain(dayCurtain){
    this.dayCurtain = dayCurtain;
  }

  getnightCurtain(nightCurtain){
    this.nightCurtain = nightCurtain;
  }

  getblackoutCurtain(blackoutCurtain){
    this.blackoutCurtain = blackoutCurtain;
  }

  getBelt(belt){
    this.belt = belt;
  }

  getOthers(others){
    this.others =  others;
  }



  pricetypes(pricetype){
    this.pricetype = pricetype;
    if (this.pricetype == "TBA") {
      this.getpricetype = "Quote";
    }else if (this.pricetype == "RW") {
        this.getpricetype = "Rewash";
    }else if (this.pricetype == "FOC") {
        this.getpricetype = "FOC";
    }else {
        this.getpricetype = "Normal";
    }
  }

  // getItem(info) {
  //   var flags = [], output = [], l = info.length, i;
  //   for (i = 0; i < l; i++) {
  //     if (flags[info[i].cat_type]) continue;
  //     flags[info[i].cat_type] = true;
  //     if (this.checkAccount ==  null) {
  //       if (this.company == 'DC') {
  //         if (info[i].cat_type == "Curtains" || info[i].cat_type == "Sofa Covers" || info[i].cat_type == "Carpet") {
  //           output.push(info[i].cat_type);
  //         }
  //       } else if (this.company== 'CC') {
  //         if (info[i].cat_type != "Curtains" && info[i].cat_type != "Sofa Covers" && info[i].cat_type != "Carpet") {
  //           output.push(info[i].cat_type);
  //         }
  //       }
  //     } else {
  //       output.push(info[i].cat_type);
  //     }
  //   }
  //   console.log(output);
  //   return output
  // }

getCompany(){
  this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
    this.mycompany = res
    this.company = this.mycompany[0].UNINV_INITIAL;
  })
}


getItem(){
    this.getCompany();

    console.log(this.checkAccount);
    if(this.checkAccount == 1){
      this.storage.get("RATES_TABLE").then(res => {
        console.log(res);
        var flags = [], output = [], l = res.length, i;
          for( i=0; i<l; i++) {
              if( flags[res[i].cat_type]) continue;
                  flags[res[i].cat_type] = true;
                  output.push(res[i].cat_type);
                   
          }
          output.push("Custom"); 
          // output.push("Curtains"); 
          console.log(output);
          this.generatedCategories = output;
        })
    }else if(this.checkAccount == 0){
      this.storage.get("ITEMS_TABLE").then(res => {
        var flags = [], output = [], l = res.length, i;
          for( i=0; i<l; i++) {
              console.log(res[i].cat_type)
              if( flags[res[i].cat_type]) continue;
                  flags[res[i].cat_type] = true;

                  if(this.company == "DC"){
                    if((res[i].cat_type == "Sofa Covers" ||  res[i].cat_type == "Carpet") || res[i].cat_type == "Curtains"){
                      output.push(res[i].cat_type);
                    }
                  }else if(this.company == "CC"){
                    if(res[i].cat_type != "Curtains" &&  res[i].cat_type != "Carpet" && res[i].cat_type != "Sofa Covers"){
                      output.push(res[i].cat_type);
                    }
                  }  
          }
          output.push("Custom"); 
          // output.push("Curtains"); 
          console.log(output);
          this.generatedCategories = output;
        })
    }
  
  }


  getSofaList(){

    this.getCompany();

    console.log(this.checkAccount);
    if(this.checkAccount == 1){
      this.storage.get("RATES_TABLE").then(res => {
        console.log(res);
        var flags = [], output = [], l = res.length, i;
          for( i=0; i<l; i++) {
              if( flags[res[i].cat_type]) continue;
                  flags[res[i].cat_type] = true;
                  output.push(res[i].cat_type);
                   
          }
          output.push("Custom"); 
          // output.push("Curtains"); 
          console.log(output);
          this.generatedCategories = output;
        })
    }else if(this.checkAccount == 0){
      this.storage.get("ITEMS_TABLE").then(res => {
        var flags = [], output = [], l = res.length, i;
          for( i=0; i<l; i++) {
              console.log(res[i].description)
              if( flags[res[i].description]) continue;
                  flags[res[i].description] = true;

                    if(res[i].cat_type == "Sofa Covers"){
                      output.push(res[i].description);
                    }
          }
          // output.push("Curtains"); 
          console.log(output);
          this.generatedSofa = output;
        })
    }
  
  }

  getSofaPrices(){
    this.storage.get('ITEMS_TABLE').then(res => {
      var l = res.length, i;
        for( i=0; i<l; i++) {

                if(res[i].description == "Sofa Cover (S)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry"){
                  this.SofaCoverLDS = res[i].price;
                  console.log(this.SofaCoverLDS);
                } 
                if(res[i].description == "Sofa Cover (S)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean"){
                  this.SofaCoverDCS = res[i].price;
                } 

                if(res[i].description == "Sofa Cover (D)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry"){
                  this.SofaCoverLDD = res[i].price;
                } 
                if(res[i].description == "Sofa Cover (D)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean"){
                  this.SofaCoverDCD = res[i].price;
                } 

                if(res[i].description == "Sofa Cover (T)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry"){
                  this.SofaCoverLDT = res[i].price;
                } 
                if(res[i].description == "Sofa Cover (T)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean"){
                  this.SofaCoverDCT = res[i].price;
                } 

                if(res[i].description == "Sofa Cover (L)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry"){
                  this.SofaCoverLDL = res[i].price;
                } 
                if(res[i].description == "Sofa Cover (L)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean"){
                  this.SofaCoverDCL = res[i].price;
                } 

                if(res[i].description == "Cushion Cover (S)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry"){
                  this.CushionCoverLDS = res[i].price;
                } 
                if(res[i].description == "Cushion Cover (S)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean"){
                  this.CushionCoverDCS = res[i].price;
                } 

                if(res[i].description == "Cushion Cover (M)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry"){
                  this.CushionCoverLDM = res[i].price;
                } 
                if(res[i].description == "Cushion Cover (M)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean"){
                  this.CushionoverDCM = res[i].price;
                } 

                if(res[i].description == "Cushion Cover (L)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry"){
                  this.CushionCoverLDL = res[i].price;
                } 
                if(res[i].description == "Cushion Cover (L)" &&  res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean"){
                  this.CushionCoverDCL = res[i].price;
                } 
        }

      })
  }


getItemPrices(){
    this.storage.get('ITEMS_TABLE').then(res => {
      var l = res.length, i;
        for( i=0; i<l; i++) {
                if(res[i].description == "Carpet/Rug (per Sqf)" &&  res[i].cat_type == "Carpet" && res[i].clean_type == "Laundry"){
                  this.carpetlaundryprice = res[i].price;
                } 
                if(res[i].description == "Carpet/Rug (per sqf)" &&  res[i].cat_type == "Carpet" && res[i].clean_type == "Dry Clean"){
                  this.carpetdrycleanprice = res[i].price;
                } 
                if(res[i].description == "Carpet Shaggy Type" &&  res[i].cat_type == "Carpet" && res[i].clean_type == "Dry Clean"){
                  this.carpetshaggyprice = res[i].price;
                } 
                if(res[i].description == "Carpet/Rug (two-sided)" &&  res[i].cat_type == "Carpet" && res[i].clean_type == "Dry Clean"){
                  this.carpetTwosidedprice = res[i].price;
                } 
                if(res[i].description == "Curtain/KG" &&  res[i].cat_type == "Curtains" && res[i].clean_type == "Laundry"){
                  this.curtainlaundrypricestr = res[i].price;
                } 
                if(res[i].description == "Curtain/KG" &&  res[i].cat_type == "Curtains" && res[i].clean_type == "Dry Clean"){
                  this.curtaindrycleanpricestr = res[i].price;
                } 
                if(res[i].description == "Curtain/R&I" &&  res[i].cat_type == "Curtains" && res[i].clean_type == "Dry Clean"){
                  this.curtainremovalpricestr = res[i].price;
                } 
        }

      })
  }

  changeCurtainsCost(){

    if (this.selectedCurtainService == "Collection") {
      // Check curtain type
      if (this.cleantypetwo == "LD" ) {
        this.pricepersqf= this.curtainlaundrypricestr;
        console.log(this.pricepersqf);
      }
      else if (this.cleantypetwo == "DC") {
        this.pricepersqf = this.curtaindrycleanpricestr;
        console.log(this.pricepersqf);
      }
    }
    else if (this.selectedCurtainService == "Removal") {
      this.pricepersqf = this.curtainremovalpricestr;
      console.log(this.pricepersqf);
    }
    
    if (this.myquan == 0) {
      this.myprice  = this.pricepersqf * this.myquan;
      this.subtotal = this.myprice ;
    }
    

  }

  calculateCarpetCost(){ 
    if(this.selectedCategory == "Carpet" && this.lengths !=  0 && this.breadthdata != 0){

      this.convertedbreadthdata  = this.lengths * this.breadthdata ;

      if (this.unittype == "cm") {
        this.convertedbreadthdata = this.convertedbreadthdata * 0.0328084 * 0.0328084;
        console.log(this.convertedbreadthdata);
      }
      
      this.convertedbreadthdata = this.convertedbreadthdata * this.pricepersqf;

      this.myprice = this.convertedbreadthdata * 100 / 100;
      this.subtotal = this.convertedbreadthdata * this.myquan;

    }else {
      this.subtotal = this.myprice * this.myquan;
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: "Please Fill all fields",
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();
  }

  curtainDesc(){
    if (this.selectedCurtainService == "Collection") {
      this.concatDescripton = "Curtains: ";
    }
    else if (this.selectedCurtainService == "Removal") {
      this.concatDescripton = this.curtaindesc + ": ";
    }

    if (this.dayCurtain != 0 && this.dayCurtain != null && this.dayCurtain != "undefined") {
      this.concatDescripton = this.concatDescripton + this.dayCurtain + "Day ";
    }
    if (this.nightCurtain != 0 && this.nightCurtain != null && this.nightCurtain != "undefined") {
      this.concatDescripton = this.concatDescripton + this.nightCurtain  + "Night ";
    }
    if (this.blackoutCurtain != 0 && this.blackoutCurtain != null && this.blackoutCurtain != "undefined") {
      this.concatDescripton = this.concatDescripton + this.blackoutCurtain  + "Blackout ";
    }
    if (this.belt != 0 && this.belt != null && this.belt != "undefined") {
      this.concatDescripton = this.concatDescripton + this.belt  + "Belt ";
    }
    if (this.others != 0 && this.others != null && this.others != "undefined") {
      this.concatDescripton = this.concatDescripton + this.others + "Other ";
    }

    this.totalItemsCurtain = this.dayCurtain + this.nightCurtain + this.blackoutCurtain  + this.belt + this.others;
  }




  addCustomItem(){
    if ((this.myquan == null || this.myquan == 0) || (this.myprice == null || this.myprice == 0) || (this.noOfPcs == null || this.noOfPcs == 0)) {
      this.presentAlert();
    }else{
      if(this.selectedCategory == "Carpet"){

        // generatedId = "999"; //custom id is 999
        // concatDesc = this.carpettype + " Carpet(" + this.lengths + this.unittype + " x " + this.breadthdata +  this.unittype  + ")"
        // selectedCategory = this.selectedCategory
        // if(this.company = "DC"){
        //   selectedCleantype = ("Dry Clean"); //default
        // }else{
        //   selectedCleantype = ("Laundry"); 
        // }
        // readytype = this.selectedreadyTypes;
        // itesmReady = "no";

        // itemPrice = Price
        // itemQty = Qty
        // itemPcs = Pcs
        // subtotal = Qty * Price


      }else if(this.selectedCategory == "Curtains"){
          this.curtainDesc();
          console.log(this.concatDescripton);

        //generatedId = "999"; //custom id is 999
        // concatDesc = this.concatDescripton
        // selectedCategory = this.selectedCategory
        // if(this.company = "DC"){
        //   selectedCleantype = ("Dry Clean"); //default
        // }else{
        //   selectedCleantype = ("Dry Clean"); 
        // }
        // readytype = this.selectedreadyTypes;
        // itesmReady = "no";

        // itemPrice = Price
        // itemQty = Qty
        // itemPcs = Pcs
        // subtotal = Qty * Price

      }else{
        if(this.normaldesc == null || this.normaldesc == 0){
          this.presentAlert();
        }else{
          
 
        }
      } 
    }
  }

  

}
