import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeliveryService } from '../api/delivery.service';
import { Storage } from '@ionic/storage';
import { AlertController,ToastController, LoadingController } from '@ionic/angular';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';

@Component({
  selector: 'app-deliveryitemview',
  templateUrl: './deliveryitemview.page.html',
  styleUrls: ['./deliveryitemview.page.scss'],
})
export class DeliveryitemviewPage implements OnInit {

  loading: any = new LoadingController;
  isLoading: boolean = false

  selectedDelivery : any;
  items: any = [];
  info: any
  email_address: any
  password: any
  ids: any


  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private delcltnSrvc: DeliveryService,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) { }

  async ngOnInit() {
    await this.presentLoading('Getting Item');
    this.getItems();
  }


  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  async presentToast(msg) {
    
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: 'medium',
      cssClass: 'customToast-class',
    });
    toast.present();
  }

  getItems() {
    this.isLoading = true
    this.storage.get('ACCOUNTS_TABLE').then(ress => {
      console.log(ress)
   
      this.storage.get('SELECTED_ITEM').then(res => {
      console.log(res)
      this.isLoading = false
      let info = {
        email: ress.email_address,
        password: ress.password,
        driverid : ress.id,
        coldelID : res.dei
      }
      console.log(info);

        Promise.resolve(this.delcltnSrvc.gettems(info)).then(data => {
           this.items = ""
           let items: any
           items = data;
           this.info = data;
           this.loading.dismiss();
           console.log(items);
        }).catch(e => {
            console.log(e);
        });
      })
    })
  }

}
