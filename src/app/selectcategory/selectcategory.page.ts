import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SelectitemlistPage } from '../selectitemlist/selectitemlist.page'
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionitemsPage } from '../collectionitems/collectionitems.page';
import { CreatecustomitemPage } from '../createcustomitem/createcustomitem.page';


@Component({
  selector: 'app-selectcategory',
  templateUrl: './selectcategory.page.html',
  styleUrls: ['./selectcategory.page.scss'],
})

export class SelectcategoryPage implements OnInit {

  dataReturned: any;
  unsyncData: any = ""

  isLoading: boolean = false
  driverInfo: any
  collectionInfo: any = ""
  category: any = ""
  loading: any = new LoadingController;
  tempItems: any = ""
  deliveryInfo: any = ""
  myColID: any = ""
  activeData: any


  constructor(
    private router: Router,
    public alertController: AlertController,
    public modalController: ModalController,
    private storage: Storage,
    private defaultSrvc: DefaultsService,
    public activatedRoute: ActivatedRoute,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,

  ) { }

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

  async ngOnInit() {
    this.tempItems = ""
    this.unsyncData = ""
    this.myColID = ""

    // this.storage.remove('TEMP_ITEMS_TABLE').then(() => {
    //   console.log('removed ');
    //   this.storage.remove('TEMP_RATES_TABLE').then(() => {
    //     console.log('removed ');
    //   })
    // })

    this.isLoading = true
    await this.presentLoading('Loading Items');
    this.myColID
    this.activatedRoute.params.subscribe((params) => {
      console.log(params)
      console.log(this.defaultSrvc.getTempItems)

      // let wew
      // wew = params
      // wew.com = "wew"
      // //console.log(wew);

      this.collectionInfo = params
      if (this.collectionInfo.coldel_type == "collection") {
        this.myColID = this.collectionInfo.id
      } else if (this.collectionInfo.coldel_type == "delivery") {
        this.defaultSrvc.getTempItems = undefined;
        this.myColID = this.collectionInfo.dei
      }
      console.log(this.myColID)
      // myColID = this.collectionInfo.id
      // if(myColID = undefined){
      //   myColID = this.collectionInfo.UNINV_COLLID
      // }
      // if(this.collectionInfo.UNINV_TYPE != "Repeat"){
      //   myColID = params.UNINV_COLLID
      // }else{
      //   myColID = this.collectionInfo.id
      // }

      //console.log(this.collectionInfo);

      this.storage.get('ACCOUNTS_TABLE').then(res => {
        this.driverInfo = res
        //console.log(this.driverInfo)

        this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
          var l = res.length, i;
          for (i = 0; i < l; i++) {
            if (res[i].UNINV_COLLID == this.myColID) {
              this.unsyncData = res[i]
            }
          }
          console.log(this.unsyncData)

          if (this.collectionInfo.com == 0 || this.collectionInfo.com == "") {
            Promise.resolve(this.defaultSrvc.getItems(this.driverInfo)).then(data => {
              //console.log('ITEMS_TABLE', data);
              this.tempItems = data
              this.tempItems.forEach(item => {
                item.is_ready = "no"
                item.qty = 0
                item.pieces = 0
                item.subtotal = 0
                item.rid = this.myColID
              });
              console.log('TEMP_ITEMS_TABLE', this.tempItems);
              this.storage.set('TEMP_ITEMS_TABLE', this.tempItems)
              // this.defaultSrvc.getTempItems = this.tempItems
              this.category = this.getItem(this.tempItems, 'items')
              this.isLoading = false


            }).catch(e => {
              //console.log(e);
              // this.loading.dismiss();

            });


          } else {
            Promise.resolve(this.defaultSrvc.getRates(this.driverInfo)).then(data => {
              //console.log('RATES_TABLE', data);
              this.tempItems = data
              this.tempItems.forEach(item => {
                item.is_ready = "no"
                item.qty = 0
                item.pieces = 0
                item.subtotal = 0
                item.rid = this.myColID
              });
              console.log('TEMP_RATES_TABLE', this.tempItems);
              this.storage.set('TEMP_RATES_TABLE', this.tempItems)
              this.category = this.getItem(this.tempItems, 'rates')
              this.isLoading = false


            }).catch(e => {
              //console.log(e);


            });
            // this.loading.dismiss();

          }
        })

      })

    });
    this.loading.dismiss();
  }

  removeItems() {
    this.defaultSrvc.getTempItems = undefined;
    // this.defaultSrvc.getCategory = ""
    this.unsyncData.UNINV_INITIAL = "";

    this.storage.remove('TEMP_ITEMS_TABLE').then(() => {
      console.log('removed ');
      this.storage.remove('TEMP_RATES_TABLE').then(() => {
        console.log('removed ');

        this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
          let data
          data = res
          let filtered: any = []
          if (data != "") {
            data.forEach(coldelData => {
              if (coldelData.UNINV_COLLID == this.myColID) {
                //delete data
              } else {
                filtered.push(coldelData)
              }
            });

            this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
          }
        }).finally(() => {
          this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
            console.log(res)
          })
          this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
            let data
            data = res
            let filtered: any = []
            if (data != "") {
              data.forEach(coldelData => {
                if (coldelData.coldelID == this.myColID) {
                  //delete data
                } else {
                  filtered.push(coldelData)
                }
              });

              this.storage.set('UNSYNCOLLECTIONLOCAL', filtered)
            }
          }).finally(() => {
            this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
              console.log(res)

            })
          })
        })
      })
    })
  }

  async removeCurrentTransaction(msg) {
    if (this.collectionInfo.coldel_type == "collection") {

    } else {
      const alert = await this.alertController.create({
        header: '',
        message: msg,
        cssClass: 'ion-alertCSS',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              alert.dismiss();
              this.tansProceed()
            }
          }, {
            text: 'No',
            handler: () => {
              alert.dismiss();
            }
          }
        ]
      });

      await alert.present();
    }
  }

  tansProceed() {
    this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      let data
      data = res
      let filtered: any = []
      if (data != "") {
        data.forEach(coldelData => {
          if (coldelData.UNINV_COLLID == this.myColID) {
            //delete data
          } else {
            filtered.push(coldelData)
          }
        });

        this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
      }
    }).finally(() => {
      this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
        console.log(res)
      })
      this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
        let data
        data = res
        let filtered: any = []
        if (data != "") {
          data.forEach(coldelData => {
            if (coldelData.coldelID == this.myColID) {
              //delete data
            } else {
              filtered.push(coldelData)
            }
          });

          this.storage.set('UNSYNCOLLECTIONLOCAL', filtered)
        }
      }).finally(() => {
        this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
          console.log(res)
          this.router.navigate(['/coldev']);
        })
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

  getItem(info, tag) {
    var flags = [], output = [], l = info.length, i;
    for (i = 0; i < l; i++) {
      if (flags[info[i].cat_type]) continue;
      flags[info[i].cat_type] = true;
      if (tag == 'items') {
        if (this.unsyncData.UNINV_INITIAL == 'DC') {
          if (info[i].cat_type == "Curtains" || info[i].cat_type == "Sofa Covers" || info[i].cat_type == "Carpet") {
            output.push(info[i].cat_type);
            // this.loading.dismiss();

          }
        } else if (this.unsyncData.UNINV_INITIAL == 'CC') {
          if (info[i].cat_type != "Curtains" && info[i].cat_type != "Sofa Covers" && info[i].cat_type != "Carpet") {
            output.push(info[i].cat_type);
            // this.loading.dismiss();

          }
        }
      } else {
        output.push(info[i].cat_type);
        // this.loading.dismiss();

      }
    }
    console.log(output);
    this.loading.dismiss();
    return output
  }



  createInvoiceItem(data) {
    //console.log(data)
    //console.log(this.tempItems)
    this.defaultSrvc.getCategory = data
    // this.defaultSrvc.getTempItems = this.tempItems
    this.router.navigate(['/selectitemlist']);
  }

  createcustomItemX() {
    this.router.navigate(['/createcustomitem']);
  }

  async createcustomItem() {
    const myModal = await this.modalController.create({
      component: CreatecustomitemPage,
      cssClass: 'viewItem-css',
      componentProps: { value: '' },
      backdropDismiss: false,
    });

    myModal.onDidDismiss().then(async data => {

      if (data['data'] != undefined) {
        //console.log(data)
        //console.log(data['data'].data)
        if (data['data'].data == 'close') {
          // this.defaultSrvc.getTempItems
        } else {
          this.defaultSrvc.getTempItems = data['data'].data
          this.tempItems = await this.getList(data['data'].data)

        }

        //console.log(this.tempItems)

      } else {

      }

    })

    myModal.present();
  }


  confirmInvoice() {
    var checkitems = "false"
    if (this.defaultSrvc.getTempItems == undefined || this.defaultSrvc.getTempItems == "") {
      this.presentToast('Please select item first')
    } else {
      if (this.collectionInfo.com == 0 || this.collectionInfo.com == "") {
        this.storage.set('TEMP_ITEMS_TABLE', this.defaultSrvc.getTempItems).then(() => {
          // this.defaultSrvc.getTempItems = this.item_List

          this.storage.get("TEMP_ITEMS_TABLE").then(res => {
            var flags = [], output = [], l = res.length, i;
            for (i = 0; i < l; i++) {
              if (res[i].rid == this.myColID && (res[i].qty != 0 && res[i].qty != null)) {
                checkitems = "true"
              } else {
                //checkitems = "false"
              }
            }
            if (checkitems == "true") {
              this.router.navigate(['/confirminvoice', this.collectionInfo]);
            } else {
              this.presentToast('Please select item first')
            }
          })
        })
      } else {
        this.storage.set('TEMP_RATES_TABLE', this.defaultSrvc.getTempItems).then(() => {
          // this.defaultSrvc.getTempItems = this.item_List
          this.storage.get("TEMP_RATES_TABLE").then(res => {
            var flags = [], output = [], l = res.length, i;
            for (i = 0; i < l; i++) {
              if (res[i].rid == this.myColID && (res[i].qty != 0 && res[i].qty != null)) {
                checkitems = "true"
              } else {
                //checkitems = "false"
              }
            }
            if (checkitems == "true") {
              this.router.navigate(['/confirminvoice', this.collectionInfo]);
            } else {
              this.presentToast('Please select item first')
            }
          })
        })
      }
    }
  }

  viewCollectionItem() {
    // this.router.navigate(['/collectionitems']);
    this.viewItems(this.tempItems)
  }

  async viewItems(info) {

    if (this.defaultSrvc.getTempItems == undefined || this.defaultSrvc.getTempItems == "") {
      this.presentToast('Please select item first')
    } else {
      var checkitems = "false"
      if (this.collectionInfo.com == 0 || this.collectionInfo.com == "") {
        this.storage.set('TEMP_ITEMS_TABLE', this.defaultSrvc.getTempItems).then(() => {
          // this.defaultSrvc.getTempItems = this.item_List
          this.storage.get("TEMP_ITEMS_TABLE").then(res => {
            var flags = [], output = [], l = res.length, i;
            for (i = 0; i < l; i++) {
              if (res[i].rid == this.myColID && (res[i].qty != 0 && res[i].qty != null)) {
                checkitems = "true"
              } else {
                //checkitems = "false"
              }
            }
            this.checkitems(checkitems, info)
          })
        })
      } else {
        this.storage.set('TEMP_RATES_TABLE', this.defaultSrvc.getTempItems).then(() => {
          // this.defaultSrvc.getTempItems = this.item_List
          this.storage.get("TEMP_RATES_TABLE").then(res => {
            var flags = [], output = [], l = res.length, i;
            for (i = 0; i < l; i++) {
              if (res[i].rid == this.myColID && (res[i].qty != 0 && res[i].qty != null)) {
                checkitems = "true"
              } else {
                //checkitems = "false"
              }
            }
            this.checkitems(checkitems, info)
          })
        })
      }

    }
  }

  async checkitems(checkitems, info) {
    if (checkitems == "true") {
      const myModal = await this.modalController.create({
        component: CollectionitemsPage,
        cssClass: 'viewItem-css',
        componentProps: { value: info },
        backdropDismiss: false,
      });

      myModal.onDidDismiss().then(async data => {

        if (data['data'] != undefined) {
          //console.log(data)
          // this.tempItems = await this.getList(data['data'].data)

        } else {

        }

      })

      myModal.present();
    } else {
      this.presentToast('Please select item first')
    }


  }

  async getList(data) {
    let res
    res = data
    let filtered: any = []
    await this.presentLoading('');

    if (res != undefined) {
      res.forEach(temp => {
        if (temp.qty != 0 && temp.qty != null) {
          filtered.push(temp)
        }
      });
    }
    this.loading.dismiss();

    return filtered
  }


}
