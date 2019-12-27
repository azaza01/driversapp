import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';
import { DeliveryService } from '../api/delivery.service';
import { SpecialinstructionService } from '../api/specialinstruction.service';
import { formatDate } from '@angular/common';
import { format } from 'util';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-coldev',
  templateUrl: './coldev.page.html',
  styleUrls: ['./coldev.page.scss'],
})
export class ColdevPage implements OnInit {

  selectedView = 'COLLECTION';
  myCollection: any = []
  myDeliveries: any = []
  myColDev: any = []

  specialIns: any
  colDelToCheck: any
  deliveryCount: any = 0
  collectionCount: any = 0



  selected: any = []
  loading: any = new LoadingController;

  constructor(
    private router: Router,
    private storage: Storage,
    private defaultSrvc: DefaultsService,
    private cltnSrvc: CollectionService,
    private delcltnSrvc: DeliveryService,
    private SplSrvc: SpecialinstructionService,
    private accSrvc: AccountsService,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
  ) { }

  async ngOnInit() {
    // this.storage.remove('COLDEL_TABLE')
    // this.ionViewWillEnter()
  }

  ionViewWillEnter() {
    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yy = new Date().getFullYear();
    today = yy + '-' + mm + '-' + dd;
    console.log(today)
    this.storage.get('COLDEL_TABLE').then(res => {
      console.log(res)
      if(res != null){
        this.myColDev = res
      }else if(res == null){
        this.coldev("Load collections and deliveries from?")
      }
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

  async getSInstruction(info, today) {
    return new Promise(resolve => {

      Promise.resolve(this.SplSrvc.getSpecialInstruction(info, today)).then(data => {
        this.specialIns = data;
        console.log(data)
        if (data != undefined) {
          this.storage.get('COLDEL_TABLE').then(res => {
            console.log(res)
            let exData = res
            var specialCounts = this.specialIns.length, i;
            // var coldevCounts = res.length, i2;
            if (this.specialIns.length > 0) {

              this.specialIns.forEach(async spI => {

                if (spI.action == "remove") {
                  this.delayToDeleteForCorsPolicy(this.accSrvc.driverData, this.defaultSrvc.getToday(), spI.id)

                  i = spI.type == 'collection' ? exData.findIndex(x => x.id == spI.against) : exData.findIndex(x => x.dei == spI.against)
                  console.log(i)
                  if (spI.type == 'collection') {
                    if (exData[i].cod != this.defaultSrvc.getToday()) {
                      exData.splice(i, 1);
                      this.storage.set('COLDEL_TABLE', exData).then(res => {
                        this.myColDev = exData;
                        console.log(this.myColDev)
                      })
                    }

                  } else if(spI.type == 'delivery') {
                    if (exData[i].ded != this.defaultSrvc.getToday()) {
                      exData.splice(i, 1);
                      this.storage.set('COLDEL_TABLE', exData).then(res => {
                        this.myColDev = exData;
                        console.log(this.myColDev)
                      })
                    }
                  } else if(i < 0){

                  }

                  console.log(this.myColDev)

                }
                resolve(true)

              });

            } else {
              resolve(true)
            }

            // for (i = 0; i < specialCounts; i++) {
            //   if (this.specialIns[i].action == "remove") {

            //     for (i2 = 0; i2 < coldevCounts; i2++) {
            //       if (res[i2].id == this.specialIns[i].against && (res[i2].cod == this.specialIns[i].against || res[i2].dei == this.specialIns[i].against) && res[i2].coldel_type == this.specialIns[i].type) {
            //         //   // this.myColDev.push = res[i2]; //need to check
            //         i = exData.findIndex(x => x.id == this.specialIns[i].against)
            //         //   this.myColDev.splice(i, 1, serverData);

            //       }
            //     }
            //     this.delayToDeleteForCorsPolicy(this.accSrvc.driverData, this.defaultSrvc.getToday(), this.specialIns[i].id)
            //   }
            // }
            // // this.storage.set('COLDEL_TABLE', this.myColDev) ////need to check
            // this.loading.dismiss();
          })
        }

      }).catch(e => {
        console.log(e);
        this.loading.dismiss();

      });

    }).catch(err => {
      console.log(err)
    })
  }

  delayToDeleteForCorsPolicy(driverdata, dattoday, myid) {
    setTimeout(() => {
      this.delSInstruction(driverdata, dattoday, myid)
    }, 3000);
  }


  async delSInstruction(info, today, coldelSplID) {
    await Promise.resolve(this.SplSrvc.delSpecialInstruction(info, today, coldelSplID)).then(data => {

    }).catch(e => {
      console.log(e);
      // this.loading.dismiss();

    });


  }

  async checkDuplicate(serverData, localData) {
    // console.log(serverData)
    // console.log(localData)
    return new Promise(resolve => {

      if (localData == null) {
        serverData.coldel_flag = "old"
        this.myColDev.push(serverData)
        this.storage.set('COLDEL_TABLE', this.myColDev).then(() => {
          resolve(true)

        })

        // let params = {
        //   UNPAY_DELID : serverData.dei,
        //   UNPAY_INVOICENO : serverData.inn,
        //   UNPAY_INITIAL : serverData.coi,
        //   UNPAY_TOTAL: serverData.toa,
        //   UNPAY_DISCOUNT : serverData.dis,
        //   UNPAY_DATE :serverData.ded,
        //   UNPAY_DEPOTYPE :serverData.dpt,
        //   UNPAY_DEPOAMT :serverData.dpa,
        //   UNPAY_BALANCELEFT :serverData.baa,
        //   UNPAY_BALANCEPAID:serverData.bap,
        //   UNPAY_BALANCETYPE: "Cash"
        // }
        // this.storage.set('UNSYNCED_PAYMENT_TABLE', params)  

      } else {

        let result;
        result = localData.filter((item) => {
          return (item.id.indexOf(serverData.id) !== -1)
        })
        // console.log(result)
        if (result.length < 1) {
          serverData.coldel_flag = "old"
          this.myColDev.push(serverData)
          console.log(this.myColDev)
          this.storage.set('COLDEL_TABLE', this.myColDev).then(() => {
            resolve(true)

          })
        } else {
          let i;
          i = localData.findIndex(x => x.id == result[0].id)
          // console.log(i);
          serverData.coldel_flag = "old"
          this.myColDev.splice(i, 1, serverData);
          console.log(this.myColDev)
          this.storage.set('COLDEL_TABLE', this.myColDev).then(() => {
            resolve(true)
          })
        }

      }

    }).catch(err => {
      console.log(err)
    })

  }

  // async getToday() {
  //   await this.presentLoading('');
  //   await this.collection(this.accSrvc.driverData, this.defaultSrvc.getToday())
  //   await this.delivery(this.accSrvc.driverData, this.defaultSrvc.getToday())
  // }

  async collection(info, today) {
    // await this.presentLoading('');
    console.log(info)
    return new Promise(resolve => {

      Promise.resolve(this.cltnSrvc.getCollection(info, today)).then(data => {
        // console.log(data);
        this.myCollection = []
        let collection: any
        collection = data;
        if (collection.length > 0) {

          collection.forEach(col => {
            col.coldel_type = "collection"
            col.coldel_hang = "nil"
            col.coldel_pack = "nil"
            col.coldel_roll = "nil"
            col.coldel_return = "nil"
            col.coldel_return = "nil"
            col.coldel_flag = "New"

            this.myCollection.push(col)
          });
          // console.log(this.myCollection);
          this.storage.get('COLDEL_TABLE').then(res => {
            // console.log(res);
            res == null ? this.myColDev = [] : this.myColDev = res
            this.myCollection.forEach(myC => {
              // myC.id = (parseInt(myC.id) + 1) + ""
              // this.checkDuplicate(myC, this.myColDev)
              Promise.resolve(this.checkDuplicate(myC, this.myColDev)).then(res => {
                console.log(res);

                resolve(true)
              }).catch(e => {
                console.log(e);
              });
              // this.loading.dismiss();
            });

          })

        } else {
          resolve(true)

          // this.loading.dismiss();

        }

      }).catch(e => {
        console.log(e);
        this.loading.dismiss();

      });

    }).catch(err => {
      console.log(err)
    })
  }


  async delivery(info, today) {
    // await this.presentLoading('');
    console.log(info)
    return new Promise(resolve => {

      Promise.resolve(this.delcltnSrvc.getDelivery(info, today)).then(data => {
        // console.log(data);
        this.myDeliveries = []
        let deliveries: any
        deliveries = data;
        if (deliveries.length > 0) {

          deliveries.forEach(del => {
            del.coldel_type = "delivery"
            del.coldel_returndate = ""
            del.coldel_returntime = ""
            del.coldel_flag = "New"

            this.myDeliveries.push(del)
          });
          // console.log(this.myDeliveries);
          this.storage.get('COLDEL_TABLE').then(res => {
            // console.log(res);
            res == null ? this.myColDev = [] : this.myColDev = res
            this.myDeliveries.forEach(myC => {
              // myC.id = (parseInt(myC.id) + 1) + ""
              // this.checkDuplicate(myC, this.myColDev)
              Promise.resolve(this.checkDuplicate(myC, this.myColDev)).then(res => {
                console.log(res);

                resolve(true)
              }).catch(e => {
                console.log(e);
              });
              // this.loading.dismiss();
            });

          })

        } else {
          resolve(true)
          // this.loading.dismiss();

        }
      }).catch(e => {
        console.log(e);
        this.loading.dismiss();

      });

    }).catch(err => {
      console.log(err)
    })

  }

  async colView(selected) {
    this.storage.set('SELECTED_ITEM', selected).then(() => {
      this.router.navigate(['/colectionview', selected]);

    })
  }


  delView(selected) {
    this.storage.set('SELECTED_ITEM', selected).then(() => {
      this.router.navigate(['/deliveryview', selected]);
    })
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
            // this.getToday()
            alert.dismiss();
            this.collectionCount = 0
            this.deliveryCount = 0
            this.LoadFromServer();
          }
        }, {
          text: 'LOCAL',
          handler: () => {
            alert.dismiss();
            this.LoadFromLocal()
          }
        },{
          text: 'CLOSE',
          handler: () => {
            this.countColAndDel()
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  LoadFromServer(){
    if (navigator.onLine == true) {
      this.presentLoading('Loading Data, Please Wait');
      Promise.resolve(this.collection(this.accSrvc.driverData, this.defaultSrvc.getToday())).then(res => {
        console.log(res);
        Promise.resolve(this.delivery(this.accSrvc.driverData, this.defaultSrvc.getToday())).then(res => {
          console.log(res);
          Promise.resolve(this.getSInstruction(this.accSrvc.driverData, this.defaultSrvc.getToday())).then(res => {
            console.log(res);
            this.loading.dismiss();
            this.countColAndDel()
          }).catch(e => {
            console.log(e);
          });

        }).catch(e => {
          console.log(e);
        });
      }).catch(e => {
        console.log(e);
      }).finally(() => {
      
      })
    } else {
      this.presentAlert("Please check your internet connection")
    }
  }

  LoadFromLocal(){
    this.storage.get('COLDEL_TABLE').then(res => {
      console.log(res);
      this.myColDev = res
    })
  }
  
  countColAndDel(){
    this.storage.get('COLDEL_TABLE').then(res => {
      var flags = [], output = [], l = res.length, i;
      for (i = 0; i < l; i++) {
        console.log(res[i].coldel_type)
        if(res[i].coldel_type == "collection"){
          console.log("wew")
          this.collectionCount = (this.collectionCount * 1) + 1
        }else if(res[i].coldel_type == "delivery"){
          console.log("w0w")
          this.deliveryCount = (this.deliveryCount * 1) + 1
        }
      }
      console.log(this.collectionCount)
      console.log(this.deliveryCount)
    })
  }

  // onRenderItems(event) {
  //   console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
  //    let draggedItem = this.myColDev.splice(event.detail.from,1)[0];
  //    this.myColDev.splice(event.detail.to,0,draggedItem)
  //   //this.listItems = reorderArray(this.listItems, event.detail.from, event.detail.to);
  //   event.detail.complete();
  // }
 
  // getList() {
  //   console.table(this.myColDev);
  // }

}
