import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController, MenuController } from '@ionic/angular';
import { AccountsService } from '../api/accounts.service';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ItemsService } from '../api/items.service';
import { CryptoJS } from 'crypto-js';
import { DefaultsService } from '../api/defaults.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading: any = new LoadingController;
  hash: any

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
    // let wew
    // let wew2 = []

    // wew = {
    //   INV_DATE: "2019-12-18",
    //   INV_NO: "CC-191130Ch03",
    //   INV_RUNNING: 3,
    //   INV_TYPE: "CC"
    // }
    // for (let index = 0; index < 10; index++) {
    //   wew2.push(wew)

    // }
    // this.storage.set('ENVNUM_TABLE', wew2).then(res => {

    // })
    // return

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

    await this.presentLoading('');
    // this.isLoading = true;
    // console.log(user.value)
    Promise.resolve(this.accSrvc.login(user.value)).then(data => {
      console.log(data);
      console.log(this.accSrvc.driverData)
      if (data) {

        this.storage.get('ENVNUM_TABLE').then(res => {
          let data = res
          let newSet = []
          console.log(res)

          data.forEach(inv => {
            if (inv.INV_DATE == this.defaultSrvc.getToday()) {
              // console.log('yeah')
              newSet.push(inv)

            }
          });
          // console.log(data)
          // console.log(newSet)

          this.storage.set('ENVNUM_TABLE', newSet).then(res => {
            console.log(res)
            this.router.navigate(['/home']);

          })
        })


      } else {
        this.presentToast("Invalid credentials")

      }
      this.loading.dismiss();

    }).catch(e => {
      console.log(e);
    });

  }

}
