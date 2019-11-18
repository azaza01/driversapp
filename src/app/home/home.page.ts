import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private menuCtrl: MenuController,
    private storage: Storage,

  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.storage.get('accounts_table').then(accData => {
      console.log(accData)
    });
  }
}
