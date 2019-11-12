import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-coldev',
  templateUrl: './coldev.page.html',
  styleUrls: ['./coldev.page.scss'],
})
export class ColdevPage implements OnInit {

  selectedView = 'COLLECTION';

  constructor(private router : Router, public alertController: AlertController,) { }

  ngOnInit() {
  }

  async coldev(msg) {
    const alert = await this.alertController.create({
      header: '',
      message: msg,
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'SERVER',
          handler: () => {
            //function herer
          }
        }, {
          text: 'LOCAL',
          handler: () => {
           //function herer
          }
        }
      ]
    });

    await alert.present();
  }

}
