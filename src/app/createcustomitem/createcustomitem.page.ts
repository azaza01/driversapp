import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, LoadingController } from '@ionic/angular';
import { ThrowStmt } from '@angular/compiler';
import { AlertController } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultsService } from '../api/defaults.service';

@Component({
  selector: 'app-createcustomitem',
  templateUrl: './createcustomitem.page.html',
  styleUrls: ['./createcustomitem.page.scss'],
})
export class CreatecustomitemPage implements OnInit {

  loading: any = new LoadingController;

  company: any; //sample
  checkAccount = 0;
  priceTables: any;
  informat: any;
  mycompany: any;

  //getData
  generatedCategories: any = []
  selectedCategory: any = []
  generatedSofa: any = []
  selectedsofa: any
  selectedCurtainService: any
  cleantypes: any
  selectedreadyTypes: any
  // cleantypetwo: any
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
  pricepersqf: any = 0
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


  //for saving item
  generatedId: any
  concatDesc: any
  Category: any
  cleantype: any
  readytype: any
  itesmReady: any
  itemPrice: any
  itemQty: any
  itemPcs: any
  itemsubtotal: any

  allItems: any = []
  collectedData: any = [];

  temp_List: any
  newitems: any
  item_List: any
  category: any
  driverInfo: any
  tempItems: any


  constructor(
    private router: Router,
    private storage: Storage,
    public activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    private defaultSrvc: DefaultsService,
    public modalCtrl: ModalController,

  ) { }

  async ngOnInit() {

    // console.log(this.defaultSrvc.getCategory)
    console.log(this.defaultSrvc.getTempItems)
    this.category = this.defaultSrvc.getCategory
    this.temp_List = this.defaultSrvc.getTempItems
    this.item_List = await this.getList(this.temp_List)
    console.log(this.item_List)


    this.getItem();
    this.getItemPrices();
    this.getSofaPrices();
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  async getList(data) {
    let res
    res = data
    let filtered: any = []
    await this.presentLoading('');

    if (res != undefined) {
      res.forEach(temp => {
        if (temp.qty != 0) {
          filtered.push(temp)
        }
      });
    }

    this.loading.dismiss()
    return filtered

  }

  clearCalcu() {
    this.lengths = "";
    this.subtotal = "";
    this.myprice = "";
    this.myquan = "";
    this.noOfPcs = "";
    this.breadthdata = "";
    this.totalItemsCurtain = "";
    this.dayCurtain = "";
    this.nightCurtain = "";
    this.blackoutCurtain = "";
    this.belt = "";
    this.others = "";
    this.totalItemsCurtain = "";
    this.concatDescripton = "";
    this.concatDesc = "";
    this.curtaindesc = "";
    this.normaldesc = "";
    this.cleantype = "";
    this.selectedCurtainService = "";
    this.carpettype = "";
    this.pricetype = "";
    this.cleantypes = "";
    this.readytype = "";
  }

  showSelectValue(selectedCat) {
    this.selectedCategory = selectedCat;
    this.clearCalcu();
    if (this.selectedCategory == "Sofa Covers") {
      this.getSofaList();
    }

    if (this.selectedCategory == "Carpet") {
      this.readytype = "Roll"
    } else {
      this.readytype = ""
    }
  }

  // showSelectedSofa(selectedsofa){
  //   this.selectedsofa = selectedsofa;
  //   console.log(this.selectedsofa);
  //   if(this.selectedsofa == "Sofa Cover (S)" &&  this.selectedCleantype == "LD"){
  //     this.SofaSelectedPrice = this.SofaCoverLDS;
  //     console.log(this.SofaSelectedPrice);
  //   }else if(this.selectedsofa == "Sofa Cover (S)" &&  this.selectedCleantype == "DC"){
  //     this.SofaSelectedPrice = this.SofaCoverDCS;
  //   }else if(this.selectedsofa == "Sofa Cover (D)" &&  this.selectedCleantype == "LD"){
  //     this.SofaSelectedPrice = this.SofaCoverLDD;
  //   }else if(this.selectedsofa == "Sofa Cover (D)" &&  this.selectedCleantype == "DC"){
  //     this.SofaSelectedPrice = this.SofaCoverDCD;
  //   }else if(this.selectedsofa == "Sofa Cover (T)" &&  this.selectedCleantype == "LD"){
  //     this.SofaSelectedPrice = this.SofaCoverLDT;
  //   }else if(this.selectedsofa== "Sofa Cover (T)" &&  this.selectedCleantype == "DC"){
  //     this.SofaSelectedPrice = this.SofaCoverDCT;
  //   }else if(this.selectedsofa == "Sofa Cover (L)" &&  this.selectedCleantype == "LD"){
  //     this.SofaSelectedPrice = this.SofaCoverLDL;
  //   }else if(this.selectedsofa == "Sofa Cover (L)" &&  this.selectedCleantype == "DC"){
  //     this.SofaSelectedPrice = this.SofaCoverDCL;
  //   }else if(this.selectedsofa == "Cushion Cover (S)" &&  this.selectedCleantype == "LD"){
  //     this.SofaSelectedPrice = this.CushionCoverLDS;
  //   }else if(this.selectedsofa== "Cushion Cover (S)" &&  this.selectedCleantype == "DC"){
  //     this.SofaSelectedPrice = this.CushionCoverDCS;
  //   }else if(this.selectedsofa == "Cushion Cover (M)" &&  this.selectedCleantype == "LD"){
  //     this.SofaSelectedPrice = this.CushionCoverLDM;
  //   }else if(this.selectedsofa == "Cushion Cover (M)" &&  this.selectedCleantype == "DC"){
  //     this.SofaSelectedPrice = this.CushionoverDCM;
  //   }else if(this.selectedsofa == "Cushion Cover (L)"&&  this.selectedCleantype == "LD"){
  //     this.SofaSelectedPrice = this.CushionCoverLDL;
  //   }else if(this.selectedsofa == "Cushion Cover (L)" &&  this.selectedCleantype == "DC"){
  //     this.SofaSelectedPrice = this.CushionCoverDCL;
  //   }  

  // }

  selectedCleantypes(cleantypes) {
    this.cleantypes = cleantypes;
    this.curtainDesc();
    this.changeCurtainsCost();

  }

  // cleantypes2(cleantype2){
  //   this.cleantypetwo = cleantype2;
  //   this.changeCurtainsCost();
  // }

  readyTypes(readyType) {
    this.selectedreadyTypes = readyType;
  }

  checkCurtainService(curtainService) {
    this.selectedCurtainService = curtainService
    this.changeCurtainsCost();
    this.curtainDesc();
  }


  carpettypes(carpettype) {
    this.carpettype = carpettype;
    if (this.carpettype == "Short") {
      this.pricepersqf = this.carpetlaundryprice;
    }
    else if (this.carpettype == "Shaggy") {
      this.pricepersqf = this.carpetshaggyprice;
    }
    else if (this.carpettype == "Twosided") {
      this.pricepersqf = this.carpetTwosidedprice;
    }
    this.calculateCarpetCost();
  }

  unittypes(unittype) {
    this.unittype = unittype;
    this.calculateCarpetCost();
  }

  getLength(lengths) {
    this.lengths = lengths;
    this.calculateCarpetCost();
  }

  getBreadth(breadthdata) {
    this.breadthdata = breadthdata;
    this.calculateCarpetCost();
  }

  getNormalDesc(normaldesc) {
    this.normaldesc = normaldesc;
  }

  getCurtainDesc(curtaindesc) {
    this.curtaindesc = curtaindesc;
    this.curtainDesc();
  }

  getPrice(myprice) {
    this.myprice = myprice;
    this.calculateCarpetCost();
  }
  getQuan(myquan) {
    this.myquan = myquan;
    this.calculateCarpetCost();
  }


  getSubtotal(subtotal) {
    this.subtotal = subtotal;
  }

  getdayCurtain(dayCurtain) {
    this.dayCurtain = dayCurtain;
    this.curtainDesc();
  }

  getnightCurtain(nightCurtain) {
    this.nightCurtain = nightCurtain;
    this.curtainDesc();
  }

  getblackoutCurtain(blackoutCurtain) {
    this.blackoutCurtain = blackoutCurtain;
    this.curtainDesc();
  }

  getBelt(belt) {
    this.belt = belt;
    this.curtainDesc();
  }

  getOthers(others) {
    this.others = others;
    this.curtainDesc();
  }

  onClickquan(myquan) {
    if (myquan == 0) {
      this.myquan = ""
    }
  }
  onClickprice(myprice) {
    if (myprice == 0) {
      this.myprice = ""
    }
  }
  onClickPcs(noOfPcs) {
    if (noOfPcs == 0) {
      this.noOfPcs = ""
    }
  }

  onClickLength(lengths) {
    if (lengths == 0) {
      this.lengths = ""
    }
  }

  onClickBreadth(breadthdata) {
    if (breadthdata == 0) {
      this.breadthdata = ""
    }
  }




  pricetypes(pricetype) {
    this.pricetype = pricetype;
    if (this.pricetype == "TBA") {
      this.getpricetype = "Quote";
    } else if (this.pricetype == "RW") {
      this.getpricetype = "Rewash";
    } else if (this.pricetype == "FOC") {
      this.getpricetype = "FOC";
    } else {
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

  getCompany() {
    this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      this.mycompany = res
      console.log(this.mycompany)
      this.company = this.mycompany[0].UNINV_INITIAL;
    })
  }


  getItem() {
    this.getCompany();

    console.log(this.checkAccount);
    if (this.checkAccount == 1) {
      this.storage.get("RATES_TABLE").then(res => {
        var flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (flags[res[i].cat_type]) continue;
          flags[res[i].cat_type] = true;
          output.push(res[i].cat_type);

        }
        output.push("Custom");
        // output.push("Curtains"); 
        this.generatedCategories = output;
      })
    } else if (this.checkAccount == 0) {
      this.storage.get("ITEMS_TABLE").then(res => {
        var flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (flags[res[i].cat_type]) continue;
          flags[res[i].cat_type] = true;

          if (this.company == "DC") {
            if ((res[i].cat_type == "Sofa Covers" || res[i].cat_type == "Carpet") || res[i].cat_type == "Curtains") {
              output.push(res[i].cat_type);
            }
          } else if (this.company == "CC") {
            if (res[i].cat_type != "Curtains" && res[i].cat_type != "Carpet" && res[i].cat_type != "Sofa Covers") {
              output.push(res[i].cat_type);
            }
          }
        }
        output.push("Custom");
        // output.push("Curtains"); 
        this.generatedCategories = output;
      })
    }

  }


  getSofaList() {

    this.getCompany();

    if (this.checkAccount == 1) {
      this.storage.get("RATES_TABLE").then(res => {
        var flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (flags[res[i].cat_type]) continue;
          flags[res[i].cat_type] = true;
          output.push(res[i].cat_type);

        }
        output.push("Custom");
        // output.push("Curtains"); 
        this.generatedCategories = output;
      })
    } else if (this.checkAccount == 0) {
      this.storage.get("ITEMS_TABLE").then(res => {
        var flags = [], output = [], l = res.length, i;
        for (i = 0; i < l; i++) {
          if (flags[res[i].description]) continue;
          flags[res[i].description] = true;

          if (res[i].cat_type == "Sofa Covers") {
            output.push(res[i].description);
          }
        }
        // output.push("Curtains"); 
        this.generatedSofa = output;
      })
    }

  }

  getSofaPrices() {
    this.storage.get('ITEMS_TABLE').then(res => {
      var l = res.length, i;
      for (i = 0; i < l; i++) {

        if (res[i].description == "Sofa Cover (S)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry") {
          this.SofaCoverLDS = res[i].price;
        }
        if (res[i].description == "Sofa Cover (S)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean") {
          this.SofaCoverDCS = res[i].price;
        }

        if (res[i].description == "Sofa Cover (D)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry") {
          this.SofaCoverLDD = res[i].price;
        }
        if (res[i].description == "Sofa Cover (D)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean") {
          this.SofaCoverDCD = res[i].price;
        }

        if (res[i].description == "Sofa Cover (T)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry") {
          this.SofaCoverLDT = res[i].price;
        }
        if (res[i].description == "Sofa Cover (T)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean") {
          this.SofaCoverDCT = res[i].price;
        }

        if (res[i].description == "Sofa Cover (L)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry") {
          this.SofaCoverLDL = res[i].price;
        }
        if (res[i].description == "Sofa Cover (L)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean") {
          this.SofaCoverDCL = res[i].price;
        }

        if (res[i].description == "Cushion Cover (S)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry") {
          this.CushionCoverLDS = res[i].price;
        }
        if (res[i].description == "Cushion Cover (S)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean") {
          this.CushionCoverDCS = res[i].price;
        }

        if (res[i].description == "Cushion Cover (M)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry") {
          this.CushionCoverLDM = res[i].price;
        }
        if (res[i].description == "Cushion Cover (M)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean") {
          this.CushionoverDCM = res[i].price;
        }

        if (res[i].description == "Cushion Cover (L)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Laundry") {
          this.CushionCoverLDL = res[i].price;
        }
        if (res[i].description == "Cushion Cover (L)" && res[i].cat_type == "Sofa Covers" && res[i].clean_type == "Dry Clean") {
          this.CushionCoverDCL = res[i].price;
        }
      }

    })
  }


  getItemPrices() {
    this.storage.get('ITEMS_TABLE').then(res => {
      var l = res.length, i;
      for (i = 0; i < l; i++) {
        if (res[i].description == "Carpet/Rug (per Sqf)" && res[i].cat_type == "Carpet" && res[i].clean_type == "Laundry") {
          this.carpetlaundryprice = res[i].price;
        }
        if (res[i].description == "Carpet/Rug (per sqf)" && res[i].cat_type == "Carpet" && res[i].clean_type == "Dry Clean") {
          this.carpetdrycleanprice = res[i].price;
        }
        if (res[i].description == "Carpet Shaggy Type" && res[i].cat_type == "Carpet" && res[i].clean_type == "Dry Clean") {
          this.carpetshaggyprice = res[i].price;
        }
        if (res[i].description == "Carpet/Rug (two-sided)" && res[i].cat_type == "Carpet" && res[i].clean_type == "Dry Clean") {
          this.carpetTwosidedprice = res[i].price;
        }
        if (res[i].description == "Curtain/KG" && res[i].cat_type == "Curtains" && res[i].clean_type == "Laundry") {
          this.curtainlaundrypricestr = res[i].price;
        }
        if (res[i].description == "Curtain/KG" && res[i].cat_type == "Curtains" && res[i].clean_type == "Dry Clean") {
          this.curtaindrycleanpricestr = res[i].price;
        }
        if (res[i].description == "Curtain/R&I" && res[i].cat_type == "Curtains" && res[i].clean_type == "Dry Clean") {
          this.curtainremovalpricestr = res[i].price;
        }
      }

    })
  }

  changeCurtainsCost() {

    if (this.selectedCurtainService == "Collection") {
      // Check curtain type
      if (this.cleantypes == "LD") {
        this.myprice = this.curtainlaundrypricestr;
      } else if (this.cleantypes == "DC") {
        this.myprice = this.curtaindrycleanpricestr;
      }
    } else if (this.selectedCurtainService == "Removal") {
      this.myprice = this.curtainremovalpricestr;
    }

    this.curtainDesc();

    if (this.myquan != 0) {
      this.subtotal = this.myprice * this.myquan;
    }


  }

  calculateCarpetCost() {
    if (this.selectedCategory == "Carpet" && this.lengths != 0 && this.breadthdata != 0) {

      this.convertedbreadthdata = this.lengths * this.breadthdata;

      if (this.unittype == "cm") {
        this.convertedbreadthdata = this.convertedbreadthdata * 0.0328084 * 0.0328084;
      }

      this.convertedbreadthdata = this.convertedbreadthdata * this.pricepersqf;

      if (this.lengths != 0 || this.breadthdata != 0) {
        this.myprice = this.convertedbreadthdata * 100 / 100;
        this.subtotal = this.convertedbreadthdata * this.myquan;

        this.myprice = Math.round(this.myprice * 100) / 100
        this.subtotal = Math.round(this.subtotal * 100) / 100
      }

    } else {
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

  async presentAddedItem() {
    const alert = await this.alertController.create({
      message: "Added",
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();
  }

  curtainDesc() {
    this.totalItemsCurtain = 0;
    this.concatDescripton = "";

    if (this.selectedCurtainService == "Collection") {
      this.concatDescripton = "Curtains: ";
    }
    else if (this.selectedCurtainService == "Removal" && this.curtaindesc != null) {
      this.concatDescripton = this.curtaindesc + ": ";
    }

    if (this.dayCurtain != 0 && this.dayCurtain != null) {
      this.concatDescripton = this.concatDescripton + this.dayCurtain + "Day ";
      this.totalItemsCurtain = this.dayCurtain * 1;
    }

    if (this.nightCurtain != 0 && this.nightCurtain != null) {
      this.concatDescripton = this.concatDescripton + this.nightCurtain + "Night ";
      this.totalItemsCurtain += this.nightCurtain * 1

    }
    if (this.blackoutCurtain != 0 && this.blackoutCurtain != null) {
      this.concatDescripton = this.concatDescripton + this.blackoutCurtain + "Blackout ";
      this.totalItemsCurtain += this.blackoutCurtain * 1

    }
    if (this.belt != 0 && this.belt != null) {
      this.concatDescripton = this.concatDescripton + this.belt + "Belt ";
      this.totalItemsCurtain += this.belt * 1

    }
    if (this.others != 0 && this.others != null) {
      this.concatDescripton = this.concatDescripton + this.others + "Other ";
      this.totalItemsCurtain += this.others * 1

    }

    // this.totalItemsCurtain = this.dayCurtain  * 1 + this.nightCurtain * 1 + this.blackoutCurtain  * 1 + this.belt * 1 + this.others * 1;

    if (this.totalItemsCurtain > 0) {
      this.noOfPcs = this.totalItemsCurtain;
    }

  }


  addCustomItem() {
    if ((this.myquan == null || this.myquan == 0) || (this.myprice == null || this.myprice == 0) || (this.noOfPcs == null || this.noOfPcs == 0)) {
      this.presentAlert();
    } else {
      if (this.selectedCategory == "Carpet") {

        this.concatDesc = this.carpettype + " Carpet(" + this.lengths + this.unittype + " x " + this.breadthdata + this.unittype + ")"
        this.Category = this.selectedCategory
        if (this.cleantypes = "DC") {
          this.cleantype = ("Dry Clean"); //default
        } else {
          this.cleantype = ("Laundry");
        }
        this.readytype = this.selectedreadyTypes;
        this.itesmReady = "no";

        this.itemPrice = this.myprice
        this.itemQty = this.myquan
        this.itemPcs = this.totalItemsCurtain
        this.itemsubtotal = this.subtotal

        //save all above in temp_item_table
        this.saveData();


      } else if (this.selectedCategory == "Curtains") {

        this.concatDesc = this.concatDescripton
        this.Category = this.selectedCategory
        if (this.company = "DC") {
          this.cleantype = ("Dry Clean"); //default
        } else {
          this.cleantype = ("Dry Clean");
        }
        this.readytype = this.selectedreadyTypes;
        this.itesmReady = "no";

        this.itemPrice = this.myprice
        this.itemQty = this.myquan
        this.itemPcs = this.totalItemsCurtain
        this.itemsubtotal = this.subtotal

        //save all above in temp_item_table
        this.saveData();

      } else {
        if (this.normaldesc == null || this.normaldesc == 0) {
          this.presentAlert();
        } else {

          this.concatDesc = this.normaldesc;
          console.log(this.concatDesc)
          this.Category = this.selectedCategory
          if (this.cleantypes = "DC") {
            this.cleantype = ("Dry Clean"); //default
          } else {
            this.cleantype = ("Laundry");
          }
          this.readytype = this.selectedreadyTypes;
          this.itesmReady = "no";

          this.itemPrice = this.myprice
          this.itemQty = this.myquan
          this.itemPcs = this.noOfPcs
          this.subtotal = this.myprice * this.myquan
          this.itemsubtotal = this.subtotal



          //save all above in temp_item_table
          this.saveData();


        }
      }
    }
  }

  saveData() {

    this.loading.dismiss();
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      // console.log(res)
      this.driverInfo = res

      let params: any = {};
      params.id = "999"
      params.description = this.concatDesc
      params.cat_type = this.Category
      params.clean_type = this.cleantype
      params.item_ready = this.readytype
      params.price = this.itemPrice
      params.qty = this.itemQty
      params.pcs = this.itemPcs
      params.subtotal = this.itemsubtotal
      params.updated_by = res.name
      params.updated_on = this.defaultSrvc.getToday();
      params.rid = this.mycompany[0].UNINV_COLLID


      this.newitems = this.defaultSrvc.getTempItems
      this.newitems.push(params)
      console.log(this.newitems)
      this.closeModal(this.newitems)

      // this.storage.get('TEMP_ITEMS_TABLE').then(async res => {
      //   this.newitems = res.push(params)
      //   console.log(res)
      // this.storage.set('TEMP_ITEMS_TABLE', res).then(async ress => {
      //   console.log(ress);
      // // })
      // this.storage.set('TEMP_ITEMS_TABLE', this.newitems).then(() => {
      //   this.presentAddedItem();
      //   this.clearCalcu();
      // })
      // this.storage.set('TEMP_ITEMS_TABLE', this.newitems).then(() => {
      //   this.defaultSrvc.getTempItems = this.temp_List
      // })
      // })   
    })
  }

  closeModal(info) {
    this.modalCtrl.dismiss({
      data: info
    });
  }
}
