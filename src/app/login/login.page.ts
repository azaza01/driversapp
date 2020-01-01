import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController, MenuController } from '@ionic/angular';
import { AccountsService } from '../api/accounts.service';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ItemsService } from '../api/items.service';
// import { CryptoJS } from 'crypto-js';
import { DefaultsService } from '../api/defaults.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading: any = new LoadingController;
  hash: any
  password: any
  email: any

  // email: any = "davidchia@cottoncare.com.sg"
  // password: any = "fortune878"


  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    private accSrvc: AccountsService,
    private storage: Storage,
    private defaultSrvc: DefaultsService,

  ) { }

  ngOnInit() {

    // this.storage.remove('UNSYNCED_PAYMENT_TABLE')
    // this.storage.remove('UNSYNCED_INVOICE_TABLE')
    // this.storage.remove('UNSYNCOLLECTIONLOCAL')
    // this.storage.remove('TEMP_RATES_TABLE')
    // this.storage.remove('TEMP_ITEMS_TABLE')
    
    // this.storage.remove('ENVNUM_TABLE')
    // let wew
    // let wew2 = []

    // wew = {
    //   // COLID: "142823",
    //   INV_DATE: "2020-01-01",
    //   INV_TYPE: "CC",
    //   INV_RUNNING: 1,
    //   INV_NO: "CC-200101Du01"      // DriverID: 53
    // }
    // for (let index = 0; index < 1; index++) {
    //   wew2.push(wew)

    // }
    // this.storage.set('ENVNUM_TABLE', wew2).then(res => {
    //   console.log(res);
    // })


    this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      console.log(res)
    })
    this.storage.get('UNSYNCED_PAYMENT_TABLE').then(res => {
      console.log(res)
    })
    this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
      console.log(res)
    })
    this.storage.get('ENVNUM_TABLE').then(res => {
      console.log(res)
    })

  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
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

  async login(user: NgForm) {
    console.log(user.value)
    console.log(this.password)

    // if(user.value != "" && user.value != "" ){
    await this.presentLoading('Validating credentials');
    // this.isLoading = true;
    // console.log(user.value)
    Promise.resolve(this.accSrvc.login(user.value)).then(data => {
      console.log(data);
      console.log(this.accSrvc.driverData.id)
      if (data) {
        this.storage.get('ENVNUM_TABLE').then(res => {
          let data = res
          let newSet = []
          console.log(res)
        if(data != null){
          data.forEach(inv => {
            if (inv.INV_DATE == this.defaultSrvc.getToday()) { // && inv.DriverID == this.accSrvc.driverData.id
              console.log('yeah')
              newSet.push(inv)
            }
          });
          this.storage.set('ENVNUM_TABLE', newSet).then(res => {
            console.log(res)
            this.router.navigate(['/home']);
          })
         }else{
            this.router.navigate(['/home']);
         }
          // console.log(data)
          // console.log(newSet)
        })


      } else {
        this.presentToast("Invalid credentials")

      }
      this.loading.dismiss();

    }).catch(e => {
      console.log(e);
      this.loading.dismiss();
    });
    // }else{
    //   this.presentToast("Please type your credentials")
    // }

  }

}
