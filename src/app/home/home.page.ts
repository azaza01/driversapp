import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  accInfo: any
  driversdata: any[];
  currentPromo: any = []
  loading: any = new LoadingController;


  constructor(
    private menuCtrl: MenuController,
    private storage: Storage,
    private defaultSrvc: DefaultsService,
    private cltnSrvc: CollectionService,
    private accSrvc: AccountsService,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
  ) { }

  async ngOnInit(info) {
    // Promise.all([this.storage.get('SO_TABLE').then((data)=>{this.currentPromo=data;})]);
    // console.log(this.currentPromo);

    this.gePromotion(this.accSrvc.driverData)
    // console.log(info)
    // if (info.title == 'Sync Data') {
    // if (navigator.onLine == true) {
    //   await this.storage.get('ACCOUNTS_TABLE').then(accData => {
    //     console.log(accData)
    //       if (accData == null) {
    //         Promise.resolve(this.defaultSrvc.syncAll(accData)).then((data) => {
    //           console.log(data);
    //           this.presentAlert('Syncing Successful')
    //         }).catch(e => {
    //           console.log(e);
    //         });
    //       } else {
    //         // this.presentAlert('Problem Syncing, Please check internet Connection')
    //       }
    //   });
    // } else {
    //   this.presentAlert('Problem Syncing, Please check internet Connection')
    // }
    // }
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

  ionViewWillEnter() {
    this.menuCtrl.enable(true);

    // this.storage.remove('ACCOUNTS_TABLE').then(() => {})



    this.storage.get('ACCOUNTS_TABLE').then(res => {
      // console.log(res)
      this.accInfo = res;
      // let totalArray = [];
      // totalArray.push(res);
      this.driversdata = res
      console.log(this.driversdata)

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


  async gePromotion(info) {
    // this.loading.present();
    // this.currentPromo = "";
    await Promise.resolve(this.accSrvc.getStandingOrder(info)).then(data => {
      console.log(data)
      this.currentPromo.push(data)

      //    this.storasge.get('SO_TABLE').then(res => {
      //     console.log(res)
      //     console.log(this.currentPromo);

      //  })
      // this.storage.set('SO_TABLE', data).then(() => {
      //   this.displayPromo();
      // })

    }).catch(e => {
      console.log(e);
      // this.loading.dismiss();
    });
  }



  tester() {
    this.defaultSrvc.clearsyncsStorage()
    return
    Promise.resolve(this.cltnSrvc.getCollection(this.accInfo, '')).then(data => {
      console.log(data);

    }).catch(e => {
      console.log(e);
    });
  }

}
