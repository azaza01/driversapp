import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';
import { DeliveryService } from '../api/delivery.service';
import { SpecialinstructionService } from '../api/specialinstruction.service';
import { formatDate } from '@angular/common';
import { format } from 'util';
import { SyncinvoiceService } from '../api/syncinvoice.service';
import { SyncdeliveryService } from '../api/syncdelivery.service'


@Component({
  selector: 'app-unsyncdata',
  templateUrl: './unsyncdata.page.html',
  styleUrls: ['./unsyncdata.page.scss'],
})
export class UnsyncdataPage implements OnInit {

  selectedViewSync = 'COLLECTION';
  unsyncCollection: any 
  unsyncDeliveries: any
  unsyncLocalollection: any

  loading: any = new LoadingController;
  UNINV_AGREEDDELIVERYDATE: any
  UNINV_INVNO: any
  ppdate: any

  constructor(
    private router: Router,
    private storage: Storage,
    private defaultSrvc: DefaultsService,
    private cltnSrvc: CollectionService,
    private delcltnSrvc: DeliveryService,
    private SplSrvc: SpecialinstructionService,
    private accSrvc: AccountsService,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    public syncinvoiceSrvs: SyncinvoiceService,
    public syncdeliverySrvs: SyncdeliveryService
  ) { }

  async ngOnInit() {
    // this.ionViewWillEnter();
    // this.loading.dismiss();
  }

  async ionViewWillEnter() {

    // await this.presentLoading('Collecting Local Data');
    await Promise.resolve(this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      console.log(res)
      if (res != null) {
        this.unsyncCollection = res
      } else {
        this.unsyncCollection = ""
      }

      // this.loading.dismiss();
    }))

    await Promise.resolve(this.storage.get('UNSYNCED_PAYMENT_TABLE').then(ress => {
      console.log(ress)
      if (ress != null) {
        this.unsyncDeliveries = ress
      } else {
        this.unsyncDeliveries = ""
      }
    }))

    await Promise.resolve(this.storage.get('UNSYNCOLLECTIONLOCAL').then(data => {
      console.log(data)
      if (data != null) {
        this.unsyncLocalollection = data
      } else {
        this.unsyncLocalollection = ""
      }
    }))


  }

  async syncCollection(selected) {
    // console.log(selected)
    if (navigator.onLine == true) {
      await Promise.resolve(this.syncinvoiceSrvs.addinvoiceServiceLocal(selected)).then(data => {
        if (data == true) {
          //delete local
          this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
            let data
            data = res
            let filtered: any = []
            console.log(data)
            if (data != null) {
              data.forEach(unsync => {
                if (unsync.UNINV_COLLID == selected.UNINV_COLLID) {

                } else {
                  filtered.push(unsync)
                }
              });
              this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
              this.presentAlert("Collection Successfully Sync")
            }

          }).finally(() => {
            // this.storage.get('UNSYNCED_INVOICE_TABLE').then(ress => {
            //   console.log(ress)
            this.ionViewWillEnter();
            // })
          })

        } else {
          this.presentAlert("Cannot sync, poor internet connection. Please save later")
          // this.loading.dismiss();
        }
      }).catch(e => {
        console.log(e);
        this.presentAlert("Cannot sync, poor internet connection. Please save later")
        // this.loading.dismiss();
      });
    } else {
      this.presentAlert("Cannot sync, poor internet connection. Please save later")
      // this.loading.dismiss();
    }
  }

  async syncDelivery(selected) {
    console.log(selected)
    if (navigator.onLine == true) {
      await Promise.resolve(this.syncdeliverySrvs.syncdeliverysrvcLocal(selected)).then(data => {
        if (data == true) {
          //delete local
          this.storage.get('UNSYNCED_PAYMENT_TABLE').then(res => {
            let data
            data = res
            console.log(data)
            let filtered: any = []

            if (data != null) {
              data.forEach(unsync => {
                if (unsync.delid == selected.delid) {
                  console.log("Deleted")
                } else {
                  filtered.push(unsync)
                }
              });
              this.storage.set('UNSYNCED_PAYMENT_TABLE', filtered)
              this.presentAlert("Delivery Successfully Sync")
            }
          }).finally(() => {
            // this.storage.get('UNSYNCED_PAYMENT_TABLE').then(ress => {
            //   console.log(ress)
            this.ionViewWillEnter();
            // })
          })
        } else {
          this.presentAlert("Cannot sync, poor internet connection. Please save later")
          // this.loading.dismiss();
        }
      }).catch(e => {
        console.log(e);
        this.presentAlert("Cannot sync, poor internet connection. Please save later")
        // this.loading.dismiss();
      });
    } else {
      this.presentAlert("Cannot sync, poor internet connection. Please save later")
      // this.loading.dismiss();
    }
  }

  async syncColLoc(selected) {
    console.log(selected)
    if (navigator.onLine == true) {
      await Promise.resolve(this.syncinvoiceSrvs.addinvoiceFromLocal(selected)).then(returnID => {
        console.log(returnID)
        if (returnID == "" || returnID != false) {
          //delete local

          this.presentAlert("Local Collection Synced, You can now sync invoice")

          this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
            let data
            data = res
            console.log(data)
            let filtered: any = []
            console.log(selected.UNINV_COLLTS)
            if (data != null) {
              console.log("papasok ba")
              data.forEach(unsync => {
                console.log("pumasok naman")
                if (unsync.UNINV_COLLTS == selected.rid) {
                  let params: any = {
                    UNINV_COLLTS: returnID,
                    UNINV_COLLID: returnID,
                    UNINV_INVNO: unsync.UNINV_INVNO,
                    UNINV_CUSTID: unsync.UNINV_CUSTID,
                    UNINV_INITIAL: unsync.UNINV_INITIAL,
                    UNINV_TYPE: unsync.UNINV_TYPE,
                    UNINV_DEPOAMT: unsync.UNINV_DEPOAMT,
                    UNINV_DEPOTYPE: unsync.UNINV_DEPOTYPE,
                    UNINV_BALANCE: unsync.UNINV_BALANCE,
                    UNINV_AGREEDDELIVERYDATE: unsync.UNINV_AGREEDDELIVERYDATE,
                    UNINV_DELIVERYTIMESLOT: unsync.UNINV_DELIVERYTIMESLOT,
                    UNINV_INVOICENOTE: unsync.UNINV_INVOICENOTE,
                    UNINV_DISCOUNT: unsync.UNINV_DISCOUNT,
                    UNINV_EXPRESS: unsync.UNINV_EXPRESS,
                    UNINV_HASDONATE: unsync.UNINV_HASDONATE,
                    UNINV_DONATE: unsync.UNINV_DONATE,
                    UNINV_BAGS: unsync.UNINV_BAGS,
                    drvna: unsync.drvna,
                    drvpa: unsync.drvpa,
                    drvem: unsync.drvem,
                    colitem: unsync.colitem,
                    UNINV_SAVEDON: unsync.UNINV_SAVEDON,
                    syncserver: "true"
                  }
                  console.log(params)
                  filtered.push(params)
                } else {
                  filtered.push(unsync)
                }
              });
              this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
            }
          }).finally(() => {
            this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
              let data
              data = res
              console.log(data)
              let filtered: any = []
              console.log(selected.UNINV_COLLTS)
              if (data != null) {
                data.forEach(unsync => {
                  if (unsync.rid == selected.rid) {
                    
                  } else {
                    filtered.push(unsync)
                  }
                });
                this.storage.set('UNSYNCOLLECTIONLOCAL', filtered)
              }
            })

            this.ionViewWillEnter();
            // })
          })
        } else {
          this.presentAlert("Cannot sync, poor internet connection. Please save later")
          // this.loading.dismiss();
        }
      }).catch(e => {
        console.log(e);
        this.presentAlert("Cannot sync, poor internet connection. Please save later")
        // this.loading.dismiss();
      });
    } else {
      this.presentAlert("Cannot sync, poor internet connection. Please save later")
      // this.loading.dismiss();
    }
  }


  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }


  async presentAlert(msg) {
    const alert = await this.alertController.create({
      // header: 'Sync Data',
      // subHeader: 'Subtitle',
      message: msg,
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();

  }


}

