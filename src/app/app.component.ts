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
      title: 'Unsync Col and Del',
      url: '/unsyncdata',
      icon: 'md-sync'
    }
    // ,
    // {
    //   title: 'Driver Summary',
    //   url: '/driversummary',
    //   icon: 'logo-usd'
    // }
    // {
    //   title: 'Create Invoice',
    //   url: this.showAlert("Please Pick"),
    //   icon: 'md-document'
    // }
    // {
    //   title: 'Print',
    //   url: '',
    //   icon: 'md-print'
    // },
    // {
    //   title: 'Download latest Version',
    //   url: '',
    //   icon: 'md-cloud-download'
    // }
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


  // ionViewDidEnter() {
  //   document.addEventListener("backbutton",function(e) {
  //     console.log("disable back button")
  //   }, false);
  // }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('hello');
        }, false);
      });
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

  async showAlert(msg){
    const alert = await this.alertController.create({
      header: '',
      message: msg,
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'CREATE INVOICE',
          handler: async () => {
            this.router.navigate(['/createlocalinvoice']);
          }
        }, {
          text: 'ADD CUSTOMER',
          handler: async () => {
            this.router.navigate(['/createlocalcustomer']);
          }
        }
      ],
    });

    await alert.present();
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
                // this.storage.remove('UNSYNCED_INVOICE_TABLE').then(() => {
                //   console.log('removed '); 
                //   this.storage.remove('UNSYNCED_PAYMENT_TABLE').then(() => {
                //     console.log('removed '); 
                  this.storage.remove('SO_TABLE').then(() => {
                    console.log('removed ');                  
                  this.router.navigate(['/login']);
              //   })
              // })
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



//   ngAfterViewInit() {
//     var $: any;
//     // This element never changes.
//     let ionapp = document.getElementsByTagName("ion-app")[0];

//     window.addEventListener('keyboardDidShow', async (event) => {
//         // Move ion-app up, to give room for keyboard
//         let kbHeight: number = event["keyboardHeight"];
//         let viewportHeight: number = $(window).height();
//         let inputFieldOffsetFromBottomViewPort: number = viewportHeight - $(':focus')[0].getBoundingClientRect().bottom;
//         let inputScrollPixels = kbHeight - inputFieldOffsetFromBottomViewPort;

//         // Set margin to give space for native keyboard.
//         ionapp.style["margin-bottom"] = kbHeight.toString() + "px";

//         // But this diminishes ion-content and may hide the input field...
//         if (inputScrollPixels > 0) {
//             // ...so, get the ionScroll element from ion-content and scroll correspondingly
//             // The current ion-content element is always the last. If there are tabs or other hidden ion-content elements, they will go above.
//             let ionScroll = await $("ion-content").last()[0].getScrollElement();
//             setTimeout(() => {
//                 $(ionScroll).animate({
//                     scrollTop: ionScroll.scrollTop + inputScrollPixels
//                 }, 300);
//             }, 300); // Matches scroll animation from css.
//         }
//     });
//     window.addEventListener('keyboardDidHide', () => {
//         // Move ion-app down again
//         // Scroll not necessary.
//         ionapp.style["margin-bottom"] = "0px";
//     });
// }


}
