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
  unsyncData: any;
  isLoading: boolean = false
  driverInfo: any
  collectionInfo: any
  category: any
  loading: any = new LoadingController;
  tempItems: any

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
    this.isLoading = true
    await this.presentLoading('');

    this.activatedRoute.params.subscribe((params) => {
      // let wew
      // wew = params
      // wew.com = "wew"
      // console.log(wew);
      this.collectionInfo = params
      console.log(this.collectionInfo);

      this.storage.get('ACCOUNTS_TABLE').then(res => {
        this.driverInfo = res
        // console.log(this.driverInfo)

        this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
          this.unsyncData = res
          console.log(this.unsyncData)

          if (this.collectionInfo.com == 0 || this.collectionInfo.com == "") {
            Promise.resolve(this.defaultSrvc.getItems(this.driverInfo)).then(data => {
              // console.log('ITEMS_TABLE', data);
              this.tempItems = data
              this.tempItems.forEach(item => {
                item.is_ready = "no"
                item.qty = 0
                item.pieces = 0
                item.subtotal = 0
                item.rid = this.collectionInfo.id
              });
              console.log('TEMP_ITEMS_TABLE', this.tempItems);
              this.storage.set('TEMP_ITEMS_TABLE', this.tempItems)
              // this.defaultSrvc.getTempItems = this.tempItems
              this.category = this.getItem(this.tempItems, 'items')
              this.isLoading = false
              this.loading.dismiss();

            }).catch(e => {
              console.log(e);
              this.loading.dismiss();

            });
            this.loading.dismiss();

          } else {
            Promise.resolve(this.defaultSrvc.getRates(this.driverInfo)).then(data => {
              console.log('RATES_TABLE', data);
              this.tempItems = data
              this.tempItems.forEach(item => {
                item.is_ready = "no"
                item.qty = 0
                item.pieces = 0
                item.subtotal = 0
                item.rid = this.collectionInfo.id
              });
              console.log('TEMP_RATES_TABLE', this.tempItems);
              this.storage.set('TEMP_RATES_TABLE', this.tempItems)
              this.category = this.getItem(this.tempItems, 'rates')
              this.isLoading = false
              this.loading.dismiss();

            }).catch(e => {
              console.log(e);
              this.loading.dismiss();

            });
            this.loading.dismiss();

          }
        })

      })

    });

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
        if (this.unsyncData[0].UNINV_INITIAL == 'DC') {
          if (info[i].cat_type == "Curtains" || info[i].cat_type == "Sofa Covers" || info[i].cat_type == "Carpet") {
            output.push(info[i].cat_type);
            this.loading.dismiss();

          }
        } else if (this.unsyncData[0].UNINV_INITIAL == 'CC') {
          if (info[i].cat_type != "Curtains" && info[i].cat_type != "Sofa Covers" && info[i].cat_type != "Carpet") {
            output.push(info[i].cat_type);
            this.loading.dismiss();

          }
        }
      } else {
        output.push(info[i].cat_type);
        this.loading.dismiss();

      }
    }
    console.log(output);
    return output
  }



  createInvoiceItem(data) {
    console.log(data)
    console.log(this.tempItems)
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
        console.log(data)
        // this.tempItems = await this.getList(data['data'].data)

      } else {

      }

    })

    myModal.present();
  }


  confirmInvoice() {
    console.log(this.defaultSrvc.getTempItems)

    if (this.defaultSrvc.getTempItems == undefined) {
      this.presentToast('Please select item first')
    } else {
      this.storage.set('TEMP_ITEMS_TABLE', this.defaultSrvc.getTempItems).then(() => {
        // this.defaultSrvc.getTempItems = this.item_List
        this.router.navigate(['/confirminvoice']);
      })
    }
  }

  viewCollectionItem() {
    // this.router.navigate(['/collectionitems']);
    this.viewItems(this.tempItems)
  }

  async viewItems(info) {
    const myModal = await this.modalController.create({
      component: CollectionitemsPage,
      cssClass: 'viewItem-css',
      componentProps: { value: info },
      backdropDismiss: false,
    });

    myModal.onDidDismiss().then(async data => {

      if (data['data'] != undefined) {
        console.log(data)
        this.tempItems = await this.getList(data['data'].data)

      } else {

      }

    })

    myModal.present();
  }

  async getList(data) {
    let res
    res = data
    let filtered: any = []
    await this.presentLoading('');

    if(res != undefined){
      res.forEach(temp => {
        if (temp.qty != 0) {
          filtered.push(temp)
        }
      });
    }

    this.loading.dismiss()
    return filtered
  }




  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: SelectitemlistPage
  //   });
  //   return await modal.present();
  // }

  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: SelectitemlistPage,
  //     componentProps: {
  //       "paramID": 123,
  //       "paramTitle": "Test Title"
  //     }
  //   });

  //   modal.onDidDismiss().then((dataReturned) => {
  //     if (dataReturned !== null) {
  //       this.dataReturned = dataReturned.data;
  //       //alert('Modal Sent Data :'+ dataReturned);
  //     }
  //   });

  //   return await modal.present();
  // }

  // async showItem() {
  //   const alert = await this.alertController.create({
  //     header: 'ADD ITEMS',
  //     // message: 'Message',
  //     cssClass: 'ion-alertCSS',
  //     label : [{
  //       name: 'one'
  //     },],
  //     inputs: [
  //       {
  //         name: 'checkbox1',
  //         type: 'number',
  //         label: 'Checkbox 1',
  //         value: 'value1',
  //       },

  //      ],
  //     buttons: [
  //       {
  //         text: 'CANCEL',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //          //nofunction
  //         }
  //       }, {
  //         text: 'ADD',
  //         handler: () => {
  //          //function here

  //         }
  //       }
  //     ],
  //   });

  //   await alert.present();
  // }

}
