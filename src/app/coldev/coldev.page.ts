import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DefaultsService } from '../api/defaults.service';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';
import { DeliveryService } from '../api/delivery.service';
import { formatDate } from '@angular/common';
import { format } from 'util';

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
    // this.storage.remove('COLDEL_TABLE')
  }

  async ionViewWillEnter() {
    let today;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yy = new Date().getFullYear();
    today = yy + '-' + mm + '-' + dd;
    console.log(today)

    await this.presentLoading('');
    await this.collection(this.accSrvc.driverData, this.defaultSrvc.getToday())
    await this.delivery(this.accSrvc.driverData, this.defaultSrvc.getToday())
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

  async checkDuplicate(serverData, localData) {
    // console.log(serverData)
    // console.log(localData)

    if (localData == null) {
      serverData.coldel_flag = "old"
      this.myColDev.push(serverData)
      this.storage.set('COLDEL_TABLE', this.myColDev)
      
      let params = {
        UNPAY_DELID : serverData.dei,
        UNPAY_INVOICENO : serverData.inn,
        UNPAY_INITIAL : serverData.coi,
        UNPAY_TOTAL: serverData.toa,
        UNPAY_DISCOUNT : serverData.dis,
        UNPAY_DATE :serverData.ded,
        UNPAY_DEPOTYPE :serverData.dpt,
        UNPAY_DEPOAMT :serverData.dpa,
        UNPAY_BALANCELEFT :serverData.baa,
        UNPAY_BALANCEPAID:serverData.bap,
        UNPAY_BALANCETYPE: "Cash"
      }
      this.storage.set('UNSYNCED_PAYMENT_TABLE', params)

    } else {

      let result;
      result = localData.filter((item) => {
        return (item.id.indexOf(serverData.id) !== -1)
      })
      // console.log(result)
      if (result.length < 1) {
        serverData.coldel_flag = "old"
        this.myColDev.push(serverData)
        // console.log(this.myColDev)
        this.storage.set('COLDEL_TABLE', this.myColDev)

      } else {
        let i;
        i = localData.findIndex(x => x.id == result[0].id)
        // console.log(i);
        serverData.coldel_flag = "old"
        this.myColDev.splice(i, 1, serverData);
        // console.log(this.myColDev)
        this.storage.set('COLDEL_TABLE', this.myColDev)
      }

    }

  }

  async getToday() {
    await this.presentLoading('');
    await this.collection(this.accSrvc.driverData, this.defaultSrvc.getToday())
    await this.delivery(this.accSrvc.driverData, this.defaultSrvc.getToday())
  }

  async collection(info, today) {
    // await this.presentLoading('');
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
          col.coldel_flag = "new"

          this.myCollection.push(col)
        });
        // console.log(this.myCollection);
        this.storage.get('COLDEL_TABLE').then(res => {
          // console.log(res);
          res == null ? this.myColDev = [] : this.myColDev = res
          this.myCollection.forEach(myC => {
            // myC.id = (parseInt(myC.id) + 1) + ""
            this.checkDuplicate(myC, this.myColDev)
            this.loading.dismiss();
          });

        })

      } else {
        this.loading.dismiss();

      }

    }).catch(e => {
      console.log(e);
      this.loading.dismiss();

    });
  }


  async delivery(info, today) {
    // await this.presentLoading('');
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
          del.coldel_flag = "new"

          this.myDeliveries.push(del)
        });
        // console.log(this.myDeliveries);
        this.storage.get('COLDEL_TABLE').then(res => {
          // console.log(res);
          res == null ? this.myColDev = [] : this.myColDev = res
          this.myDeliveries.forEach(myC => {
            // myC.id = (parseInt(myC.id) + 1) + ""
            this.checkDuplicate(myC, this.myColDev)
            this.loading.dismiss();
          });

        })

      } else {
        this.loading.dismiss();

      }
    }).catch(e => {
      console.log(e);
      this.loading.dismiss();

    });
  }

  async colView(selected) {
    // console.log(selected)
    this.router.navigate(['/colectionview', selected]);
  }


  delView(selected) {
    this.router.navigate(['/deliveryview', selected]);
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
            this.getToday()
          }
        }, {
          text: 'LOCAL',
          handler: () => {
            this.storage.get('COLDEL_TABLE').then(res => {
              // console.log(res);
              this.myColDev = res
            })
          }
        }
      ]
    });

    await alert.present();
  }


  getSpecialInstruction(){

    // //parameters 
    // // "email", prefEmail));
		// // "password", prefPassword));
		// // "driverid", prefUserID));
    // // "date", formattedDate));

    // //siResult =  getSpecialInstructionsWS, "POST" http://ccmanager.cottoncare.com.sg/ws/specialinstructions.json
    
    // //result will delete to local and online if action = remove
    //loop result 

    //delete to coldel table where id , date & type 

    //// delete also in online  http://ccmanager.cottoncare.com.sg/ws/deletespecialinstructions.json
    //// parameters
    //// "email", prefEmail));
    //   //"password", prefPassword));
    //   //"driverid", prefUserID));
    //  //"date", formattedDate));
    // //"id", json_data.getString("id")));

  }

}

      // let dd = new Date(info.value.pdate).getDate();
      // let mm = new Date(info.value.pdate).getMonth() + 1;
      // let yy = new Date(info.value.pdate).getFullYear();
      // let hh = new Date(info.value.ptime).getHours();
      // let ms = new Date(info.value.ptime).getMinutes();
      // let x = yy + ',' + mm + ',' + dd + ' ' + hh + ':' + ms;
      // this.transDetails.pickupDate = new Date(x).getTime();