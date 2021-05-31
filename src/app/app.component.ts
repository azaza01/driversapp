import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DefaultsService } from './api/defaults.service';
// import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // myusername: any
  // mypassword: any

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
    ,
    {
      title: 'Driver Summary',
      url: '/driversummary',
      icon: 'logo-usd'
    }
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
    // private oneSignal: OneSignal,
    private defaultSrvc: DefaultsService,

  ) {
    // this.autoLogin()
    // this.getAccounts()
    this.initializeApp();


    
  }


  // ionViewDidEnter() {
  //   document.addEventListener("backbutton",function(e) {
  //     ////console.log("disable back button")
  //   }, false);
  // }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.platform.backButton.subscribeWithPriority(9999, () => {
      //   document.addEventListener('backbutton', function (event) {
      //     event.preventDefault();
      //     event.stopPropagation();
      //     ////console.log('hello');
      //   }, false);
      // });
      // if (this.platform.is('cordova')) {
      //   this.setupPush();
      // }
    });
  }



  // setupPush() {
  //   // I recommend to put these into your environment.ts
  //   this.oneSignal.startInit('4c85d5e6-63d1-43b4-af39-a2702bfb333c', '1:541549198270:android:49d40a2b649f7df486d7ef');
 
  //   this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
 
  //   // Notifcation was received in general
  //   this.oneSignal.handleNotificationReceived().subscribe(data => {
  //     let msg = data.payload.body;
  //     let title = data.payload.title;
  //     let additionalData = data.payload.additionalData;
  //     this.showAlertNew(title, msg, additionalData.task);
  //   });
 
  //   // Notification was really clicked/opened
  //   this.oneSignal.handleNotificationOpened().subscribe(data => {
  //     // Just a note that the data is a different place here!
  //     let additionalData = data.notification.payload.additionalData;
 
  //     this.showAlertNew('Notification opened', 'You already read this before', additionalData.task);
  //   });
 
  //   this.oneSignal.endInit();
  // }

  

  // async showAlertNew(title, msg, task) {
  //   const alert = await this.alertController.create({
  //     header: title,
  //     subHeader: msg,
  //     buttons: [
  //       {
  //         text: `Action: ${task}`,
  //         handler: () => {
  //           // E.g: Navigate to a specific screen
  //         }
  //       }
  //     ]
  //   })
  //   alert.present();
  // }

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
    ////console.log(info)
    if (info.title == 'Sync Data') {
      if (navigator.onLine == true) {
        this.storage.get('ACCOUNTS_TABLE').then(accData => {
          ////console.log(accData)
          Promise.resolve(this.defaultSrvc.syncAll(accData)).then((data) => {
            if (data == "12345678910") {
              this.presentAlert('Syncing Successful')
            } else {
              this.presentAlert('Connection interrupted, please try again')
            }

          }).catch(e => {
            ////console.log(e);
          });
        });
      } else {
        this.presentAlert('No internet connection')
      }
    }
  }

  // async getAccounts() {
  //   this.storage.get('REMEMBER_ME').then(accData => {
  //     ////console.log(accData)
  //     this.myusername = accData.email_address
  //     this.mypassword = accData.password

  //   });
  // }

  async autoLogin() {
    this.storage.get('ACCOUNTS_TABLE').then(accData => {
      ////console.log(accData)
      if (accData != undefined) {
        this.router.navigate(['/home']);
      }
    });
  }

  async showAlert(msg) {
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
              ////console.log('removed ');
              this.storage.remove('COLDEL_TABLE').then(() => {
                ////console.log('removed ');
                // this.storage.remove('UNSYNCED_INVOICE_TABLE').then(() => {
                //   ////console.log('removed '); 
                //   this.storage.remove('UNSYNCED_PAYMENT_TABLE').then(() => {
                //     ////console.log('removed '); 
                this.storage.remove('SO_TABLE').then(() => {
                  ////console.log('removed ');
                  this.storage.remove('TEMP_ITEMS_TABLE').then(() => {
                    ////console.log('removed ');
                    this.storage.remove('TEMP_RATES_TABLE').then(() => {
                      this.storage.remove('SELECTED_INVOICES').then(() => {
                      ////console.log('removed ');
                    }).finally(() => {
                      this.router.navigate(['/login']);
                    })
                  })
                })
                  //   })
                  // })
                })
              })
              // this.storage.remove('UNSYNCED_INVOICE_TABLE').then(() => {
              //   ////console.log('removed ');
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
