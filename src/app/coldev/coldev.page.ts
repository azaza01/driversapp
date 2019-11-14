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

    
  async colView(msg) {
    const alert = await this.alertController.create({
      header: 'Bill from which company?',
      message: msg,
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'DC',
          handler: () => {
            //function herer
            this.router.navigate(['/colectionview']);
          }
        }, {
          text: 'CC',
          handler: () => {
           //function herer
           this.router.navigate(['/colectionview']);
          }
        }
      ],
    });

    await alert.present();
  }


  delView() {
    // const alert = await this.alertController.create({
    //   header: 'Bill from which company?',
    //   message: msg,
    //   cssClass: 'ion-alertCSS',
    //   buttons: [
    //     {
    //       text: 'DC',
    //       handler: () => {
    //         //function herer
    //         this.router.navigate(['/deliveryview']);
    //       }
    //     }, {
    //       text: 'CC',
    //       handler: () => {
           //function herer
           this.router.navigate(['/deliveryview']);
    //       }
    //     }
    //   ],
    // });

    // await alert.present();
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
