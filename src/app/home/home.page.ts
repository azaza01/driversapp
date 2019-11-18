import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionService } from '../api/collection.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  accInfo: any

  constructor(
    private menuCtrl: MenuController,
    private storage: Storage,
    private defaultSrvc: DefaultsService,
    private cltnSrvc: CollectionService,

  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      console.log(res)
      this.accInfo = res;
    });
  }

  tester(){
    Promise.resolve(this.cltnSrvc.getCollection(this.accInfo)).then(data => {
      console.log(data);

    }).catch(e => {
      console.log(e);
    });
  }

}
