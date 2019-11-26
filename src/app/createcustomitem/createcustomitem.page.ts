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

  company = 'DC'; //sample
  checkAccount = 1;
  priceTables: any;

  //getData
  generatedCategories: any = []
  selectedCategory: any = []
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
  breadthdata: any
  convertedbreadthdata: any
  lengths: any 
  subtotal: any
  myprice: any
  myquan: any
  noOfPcs: any

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

  constructor(private storage: Storage, public alertController: AlertController,) { }

  ngOnInit() {
    this.getItem();
    this.getItemPrices();
  }

  clearCalcu(){
    this.subtotal = "";
    this.myprice  = "";
    this.myquan = "";
    this.noOfPcs = "";
  }

  showSelectValue(selectedCat){
    this.selectedCategory = selectedCat;
    console.log(this.selectedCategory);
    this.clearCalcu();
  }

  selectedCleantypes(cleantypes){
    this.selectedCleantype = cleantypes;
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
    console.log(normaldesc);
  }

  getCurtainDesc(curtaindesc){
    this.curtaindesc = curtaindesc;
    console.log(curtaindesc);
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
    console.log(dayCurtain);
    this.curtainDesc();
  }

  getnightCurtain(nightCurtain){
    this.nightCurtain = nightCurtain;
    console.log(nightCurtain);
    this.curtainDesc();
  }

  getblackoutCurtain(blackoutCurtain){
    this.blackoutCurtain = blackoutCurtain;
    console.log(blackoutCurtain);
    this.curtainDesc();
  }

  getBelt(belt){
    this.belt = belt;
    console.log(belt);
    this.curtainDesc();
  }

  getOthers(others){
    this.others =  others;
    console.log(others);
    this.curtainDesc();
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

getItem(){
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
    
    if (this.myquan == "" || this.myquan == null) {
      this.myquan = 1 ;
      this.noOfPcs = 1 ;
    }
    
    this.myprice  = this.pricepersqf * this.myquan;
    this.subtotal = this.myprice ;
  }

  calculateCarpetCost(){ 
    if(this.selectedCategory == "Carpet"){

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

    if (this.dayCurtain != 0 || this.dayCurtain != null ) {
      this.concatDescripton = this.concatDescripton + this.dayCurtain + "Day ";
    }
    if (this.nightCurtain != 0 || this.nightCurtain != null ) {
      this.concatDescripton = this.concatDescripton + this.nightCurtain  + "Night ";
    }
    if (this.blackoutCurtain != 0 || this.blackoutCurtain != null ) {
      this.concatDescripton = this.concatDescripton + this.blackoutCurtain  + "Blackout ";
    }
    if (this.belt != 0 || this.belt != null ) {
      this.concatDescripton = this.concatDescripton + this.belt  + "Belt ";
    }
    if (this.others != 0 || this.others != null ) {
      this.concatDescripton = this.concatDescripton + this.others + "Other ";
    }

    this.totalItemsCurtain = this.dayCurtain + this.nightCurtain + this.blackoutCurtain  + this.belt + this.others;
    console.log(this.concatDescripton);
  }

  addCustomItem(){
    if ((this.myquan == null || this.myquan == 0) || (this.myprice == null || this.myprice == 0) || (this.noOfPcs == null || this.noOfPcs == 0)) {
      this.presentAlert();
    }else{
      if(this.selectedCategory == "Carpet"){
        this.newdescription = this.carpettype + " Carpet(" + this.lengths + this.unittype + " x " + this.breadthdata +  this.unittype  + ")"
        console.log(this.newdescription);
      }else if(this.selectedCategory == "Curtains"){

        // this.totalItemsCurtain = 0;
        // this.concatDescripton = "";
        	
          
            console.log(this.totalItemsCurtain);
            console.log(this.concatDescripton);

      }else{
        if(this.normaldesc == null || this.normaldesc == 0){
          this.presentAlert();
        }else{
 
        }
      } 
    }
  }

  

}
