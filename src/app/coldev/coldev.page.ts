import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';
import { DeliveryService } from '../api/delivery.service';

@Component({
  selector: 'app-coldev',
  templateUrl: './coldev.page.html',
  styleUrls: ['./coldev.page.scss'],
})
export class ColdevPage implements OnInit {

  selectedView = 'COLLECTION';
  myCollection: any = []
  myDeliveries: any = []
  selected: any = []
  loading: any = new LoadingController;

  constructor(
    private router: Router,
    private storage: Storage,
    private defaultSrvc: DefaultsService,
    private cltnSrvc: CollectionService,
    private delcltnSrvc: DeliveryService,
    private accSrvc: AccountsService,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.collection(this.accSrvc.driverData);
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

  async collection(info) {
    await this.presentLoading('');

    Promise.resolve(this.cltnSrvc.getCollection(info)).then(data => {
      // console.log(data);
      this.myCollection = data;
      // this.myCollection = Array.of(this.myCollection); 
      console.log(this.myCollection);
      this.loading.dismiss();

    }).catch(e => {
      console.log(e);
      this.loading.dismiss();

    });
  }


  delivery(info) {
    Promise.resolve(this.delcltnSrvc.getDelivery(info)).then(data => {
      console.log(data);
      this.myDeliveries = data;
      // this.myDeliveries = Array.of(this.myDeliveries); 
      console.log(this.myDeliveries);
    }).catch(e => {
      console.log(e);
    });
  }

  async colView(selected) {
    console.log(selected)
    this.selected = selected
    const alert = await this.alertController.create({
      header: 'Bill from which company?',
      message: 'For curtains, carpets and sofa covers, please bill from DC. For any others, please bill from CC.',
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'DC',
          handler: () => {
            //function herer
            console.log(this.selected);
            this.router.navigate(['/colectionview', { data: this.selected }]);
          }
        }, {
          text: 'CC',
          handler: () => {
            //function herer
            console.log(this.selected);
            this.router.navigate(['/colectionview', this.selected]);
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
            this.collection(msg);
            this.delivery(msg);
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
