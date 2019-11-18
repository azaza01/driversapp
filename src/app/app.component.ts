import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Collection and Deliveries',
      url: '/coldev',
      icon: 'md-paper'
    }
    ,
    {
      title: 'Sync Data',
      url: '/coldev',
      icon: 'md-sync'
    }
    ,
    {
      title: 'Driver Summary',
      url: '/coldev',
      icon: 'logo-usd'
    },
    {
      title: 'Create Invoice',
      url: '/coldev',
      icon: 'md-document'
    },
    {
      title: 'Print',
      url: '/coldev',
      icon: 'md-print'
    },
    {
      title: 'Download latest Version',
      url: '/coldev',
      icon: 'md-cloud-download'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alertController: AlertController,
    private router: Router,
    private storage: Storage,

  ) {
    this.autoLogin()

    this.initializeApp();
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async autoLogin(){
    this.storage.get('ACCOUNTS_TABLE').then(accData => {
      console.log(accData)
      if(accData != undefined){
        this.router.navigate(['/home']);
      }
    });
  }
  async logout(msg) {
    const alert = await this.alertController.create({
      header: '',
      message: msg,
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'OK',
          handler: () => {
            this.storage.remove('ACCOUNTS_TABLE').then(() => {
              console.log('removed ');
              this.router.navigate(['/login']);

            }).catch((error) => {
              console.log('removed error for ' + 'authToken' + '', error);
            });
          }
        }
      ]
    });

    await alert.present();
  }


}
