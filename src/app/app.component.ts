import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DefaultsService } from './api/defaults.service';

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
      url: '/home',
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
    private defaultSrvc: DefaultsService,

  ) {
    // this.autoLogin()

    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
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

  onTap(info) {
    console.log(info)
    if (info.title == 'Sync Data') {
      this.storage.get('ACCOUNTS_TABLE').then(accData => {
        console.log(accData)
        Promise.resolve(this.defaultSrvc.syncAll(accData)).then((data) => {
          console.log(data);
          this.presentAlert('Syncing Successful')
        }).catch(e => {
          console.log(e);
        });
      });
    }
  }

  async autoLogin() {
    this.storage.get('ACCOUNTS_TABLE').then(accData => {
      console.log(accData)
      if (accData != undefined) {
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
              this.storage.remove('COLDEL_TABLE').then(() => {
                console.log('removed ');
                this.storage.remove('TIMESLOT_TABLE').then(() => {
                  console.log('removed '); 
                  this.storage.remove('SO_TABLE').then(() => {
                    console.log('removed ');                  
                  this.router.navigate(['/login']);
                })
             })
            })
              // this.storage.remove('UNSYNCED_INVOICE_TABLE').then(() => {
              //   console.log('removed ');
              // })
            })
          }
        }
      ]
    });

    await alert.present();
  }


}
