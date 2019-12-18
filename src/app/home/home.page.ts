import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  accInfo: any
  driversdata: any [];
  currentPromo: any = []
  loading: any = new LoadingController;


  constructor(
    private menuCtrl: MenuController,
    private storage: Storage,
    private defaultSrvc: DefaultsService,
    private cltnSrvc: CollectionService,
    private accSrvc: AccountsService,
    public loadingCtrl: LoadingController
  ) { }

  async ngOnInit(){
    // Promise.all([this.storage.get('SO_TABLE').then((data)=>{this.currentPromo=data;})]);
    // console.log(this.currentPromo);

    await this.gePromotion(this.accSrvc.driverData)
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



  tester(){
    this.defaultSrvc.clearsyncsStorage()
    return
    Promise.resolve(this.cltnSrvc.getCollection(this.accInfo, '')).then(data => {
      console.log(data);

    }).catch(e => {
      console.log(e);
    });
  }

}
