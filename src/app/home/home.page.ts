import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  accInfo: any
  driversdata: any[];
  currentPromo: any;


  constructor(
    private menuCtrl: MenuController,
    private storage: Storage,
    private defaultSrvc: DefaultsService,
    private cltnSrvc: CollectionService,
    private accSrvc: AccountsService,
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      // console.log(res)
      this.accInfo = res;
      // let totalArray = [];
      // totalArray.push(res);
      this.driversdata = res
      console.log(this.driversdata)

    });
    
  }

  loadPromo(){
		Promise.all([this.storage.get('SO_TABLE').then((data)=>{this.currentPromo=data;})]);
		console.log(this.currentPromo);
	}

  tester(){
    this.defaultSrvc.clearsyncsStorage()
    return
    Promise.resolve(this.cltnSrvc.getCollection(this.accInfo)).then(data => {
      console.log(data);

    }).catch(e => {
      console.log(e);
    });
  }

}
