import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';

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

  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      console.log(res)
      this.accInfo = res;
    });
  }

  tester(){
    Promise.resolve(this.defaultSrvc.getTimeslot(this.accInfo)).then(data => {
      console.log(data);

    }).catch(e => {
      console.log(e);
    });
  }

}
