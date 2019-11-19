import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController, MenuController } from '@ionic/angular';
import { AccountsService } from '../api/accounts.service';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ItemsService } from '../api/items.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading: any = new LoadingController;


  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    private accSrvc: AccountsService,
    private storage: Storage,

  ) { }

  ngOnInit() {
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
        this.router.navigate(['/home']);
      } else {
        this.presentToast("Invalid credentials")

      }
      this.loading.dismiss();

    }).catch(e => {
      console.log(e);
    });

  }

}
