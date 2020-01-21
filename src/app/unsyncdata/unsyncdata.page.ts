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
  driverInfo: any

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
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      this.driverInfo = res
      ////console.log(res)
    })
    // await this.presentLoading('Collecting Local Data');
    await Promise.resolve(this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      console.log(res)
      if (res != null) {
        let filtered: any = []
         res.forEach(unsyncin => {
              if (unsyncin.driversId == this.driverInfo.id) {
                filtered.push(unsyncin)
              } else {

              }
          });
          this.storage.set('TEMP_UNSYNCED_INVOICE_TABLE', filtered).then(()=>{
          }).finally(() => {
            this.storage.get('TEMP_UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncCollection = res
            })
          })       
      } else {
        this.unsyncCollection = ""
      }

      // this.loading.dismiss();
    }))

    await Promise.resolve(this.storage.get('UNSYNCED_PAYMENT_TABLE').then(ress => {
      console.log(ress)
      if (ress != null) {
        let filtered: any = []
        ress.forEach(unsyncpay => {
             if (unsyncpay.driversId == this.driverInfo.id) {
               filtered.push(unsyncpay)
             } else {

             }
         });
         this.storage.set('TEMP_UNSYNCED_PAYMENT_TABLE', filtered).then(()=>{
         }).finally(() => {
           this.storage.get('TEMP_UNSYNCED_PAYMENT_TABLE').then(res => {
             this.unsyncDeliveries = res
           })
         })  
      } else {
        this.unsyncDeliveries = ""
      }
    }))

    await Promise.resolve(this.storage.get('UNSYNCOLLECTIONLOCAL').then(data => {
      console.log(data)
      if (data != null) {
        let filtered: any = []
        data.forEach(unsyncinloc => {
             if (unsyncinloc.driversId == this.driverInfo.id) {
               filtered.push(unsyncinloc)
             } else {

             }
         });
         this.storage.set('TEMP_UNSYNCOLLECTIONLOCAL', filtered).then(()=>{
         }).finally(() => {
           this.storage.get('TEMP_UNSYNCOLLECTIONLOCAL').then(res => {
             this.unsyncLocalollection = res
           })
         })  
      } else {
        this.unsyncLocalollection = ""
      }
    }))


  }

  async syncCollection(selected) {
    // ////console.log(selected)
    if (navigator.onLine == true) {
      await Promise.resolve(this.syncinvoiceSrvs.addinvoiceServiceLocal(selected)).then(data => {
        if (data != "false" && data != null && data != "duplicate") {
          //delete local
          this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
            let data
            data = res
            let filtered: any = []
            ////console.log(data)
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
            this.ionViewWillEnter();
            // })
          })

        }else if (data == "duplicate") {
          ////console.log("Duplicate Invoice")
          this.coldev(selected)
        } else {
          this.presentAlert("Cannot sync, poor internet connection. Please save later")
          // this.loading.dismiss();
        }
      }).catch(e => {
        ////console.log(e);
        this.presentAlert("Cannot sync, poor internet connection. Please save later")
        // this.loading.dismiss();
      });
    } else {
      this.presentAlert("Cannot sync, poor internet connection. Please save later")
      // this.loading.dismiss();
    }
  }

  async coldev(selected) {
    const alert = await this.alertController.create({
      header: '',
      message: "Duplicate Invoice, do you want to delete this data",
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            // this.getToday()
            alert.dismiss();
            this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              let data
              data = res
              let filtered: any = []
              ////console.log(data)
              if (data != null) {
                data.forEach(unsync => {
                  if (unsync.UNINV_COLLID == selected.UNINV_COLLID) {
  
                  } else {
                    filtered.push(unsync)
                  }
                });
                this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
                this.presentAlert("Remove Succesfully")
              }
  
            }).finally(() => {
              this.ionViewWillEnter();
            })
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


  async syncDelivery(selected) {
    ////console.log(selected)
    if (navigator.onLine == true) {
      await Promise.resolve(this.syncdeliverySrvs.syncdeliverysrvcLocal(selected)).then(data => {
        if (data == "true" || data != null) {
          //delete local
          this.storage.get('UNSYNCED_PAYMENT_TABLE').then(res => {
            let data
            data = res
            ////console.log(data)
            let filtered: any = []

            if (data != null) {
              data.forEach(unsync => {
                if (unsync.delid == selected.delid) {
                  ////console.log("Deleted")
                } else {
                  filtered.push(unsync)
                }
              });
              this.storage.set('UNSYNCED_PAYMENT_TABLE', filtered)
              this.presentAlert("Delivery Successfully Sync")
            }
          }).finally(() => {
            // this.storage.get('UNSYNCED_PAYMENT_TABLE').then(ress => {
            //   ////console.log(ress)
            this.ionViewWillEnter();
            // })
          })
        } else {
          this.presentAlert("Cannot sync, poor internet connection. Please save later")
          // this.loading.dismiss();
        }
      }).catch(e => {
        ////console.log(e);
        this.presentAlert("Cannot sync, poor internet connection. Please save later")
        // this.loading.dismiss();
      });
    } else {
      this.presentAlert("Cannot sync, poor internet connection. Please save later")
      // this.loading.dismiss();
    }
  }

  async syncColLoc(selected) {
    ////console.log(selected)
    if (navigator.onLine == true) {
      this.presentLoading('Syncing Collection');
      await Promise.resolve(this.syncinvoiceSrvs.addinvoiceFromLocal(selected)).then(returnID => {
        let data = returnID
        ////console.log(returnID)
        if (returnID != false || returnID != "") {
          this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
            let data
            data = res
            ////console.log(data)
            let filtered: any = []
            ////console.log(selected.UNINV_COLLTS)
            if (data != false) {
              ////console.log("papasok ba")
              data.forEach(unsync => {
                ////console.log("pumasok naman")
                if (unsync.UNINV_COLLID == selected.rid) {
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
                    syncserver: "true",
                    driversId : this.driverInfo.id
                  }
                  ////console.log(params)
                  filtered.push(params)
                } else {
                  filtered.push(unsync)
                }
              });

              this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
            }
          }).then(() => {
            this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
              let data
              data = res
              ////console.log(data)
              let filtered: any = []
              ////console.log(selected.UNINV_COLLTS)
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
          }).finally(() => {
            this.presentAlert("Local Collection Synced, You can now sync invoice")
            this.ionViewWillEnter();
            // })
          })
        } else {
          this.presentAlert("Cannot sync, poor internet connection. Please save later")
          // this.loading.dismiss();
        }

      }).catch(e => {
        ////console.log(e);
        this.presentAlert("Cannot sync, poor internet connection. Please save later")
        // this.loading.dismiss();
      });
    } else {
      this.presentAlert("Cannot sync, poor internet connection. Please save later")
      // this.loading.dismiss();
    }
    this.loading.dismiss();
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

