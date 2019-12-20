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

@Component({
  selector: 'app-unsyncdata',
  templateUrl: './unsyncdata.page.html',
  styleUrls: ['./unsyncdata.page.scss'],
})
export class UnsyncdataPage implements OnInit {

  selectedViewSync = 'COLLECTION';
  unsyncCollection: any 
  unsyncDeliveries: any

  loading: any = new LoadingController;
  UNINV_AGREEDDELIVERYDATE: any
  UNINV_INVNO: any

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
  ) { }

  async ngOnInit() {
    this.ionViewWillEnter();
  }

  async ionViewWillEnter(){
    await this.presentLoading('Collecting Local Data');
    Promise.resolve(this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      this.unsyncCollection = res
      console.log(res)
      this.loading.dismiss();
    })).then(data => {
      
      this.loading.dismiss();
    })  
  }

  syncCollection(selected) {
    console.log(selected)
    if (navigator.onLine == true) {
      Promise.resolve(this.syncinvoiceSrvs.addinvoiceServiceLocal(selected)).then(data => {
        if (data == true) {
          //delete local
          this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
            let data
            data = res
            let filtered: any = []
      
            if(data != null){
              data.forEach(unsync => {
                if (unsync.UNINV_COLLID == selected.UNINV_COLLID) {
                 
                } else {
                  filtered.push(unsync)
                }
              });
              console.log(filtered)
              this.storage.set('UNSYNCED_INVOICE_TABLE', filtered)
              this.loading.dismiss();
            }
          }).finally(() => {
            this.storage.get('UNSYNCED_INVOICE_TABLE').then(datum => {
              console.log(datum)
              this.presentAlert("Invoice Successfully Sync")
              this.ionViewWillEnter();
            })
          })
        } else {
          this.presentAlert("Cannot sync, poor internet connection. Please save later")
        }
      }).catch(e => {
        console.log(e);
        this.presentAlert("Cannot sync, poor internet connection. Please save later")
      });
    } else {
      this.presentAlert("Cannot sync, poor internet connection. Please save later")
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

