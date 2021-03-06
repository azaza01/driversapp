import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { Storage } from '@ionic/storage';
import { notEqual } from 'assert';
import { CollectionService } from '../api/collection.service';
import { AccountsService } from '../api/accounts.service';
import { DeliveryService } from '../api/delivery.service';
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-deliveryview',
  templateUrl: './deliveryview.page.html',
  styleUrls: ['./deliveryview.page.scss'],
})
export class DeliveryviewPage implements OnInit {

  loading: any = new LoadingController;

  deliveryInfo: any = []
  driverInfo: any
  isLoading: boolean = false
  unsyncData: any;

  selectedDelivery: any;

  currentisntruction: any

  customerEmail: any
  customerId: any

  callnumber: any

  invoiceNo: any
  invoiceID: any

  postponeDate: any

  timeslots: any = []
  selectedtime: any
  originalDate: any
  selectedDate: any
  today: any
  selectedTimeValue: any
  reasonofpostpone: any = "";
  isDisabled = true;

  constructor(
    private router: Router,
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute,
    private defaultSrvc: DefaultsService,
    private delSrvc: DeliveryService,
    private storage: Storage,
    private accSrvc: AccountsService,
    public loadingCtrl: LoadingController,
    private cltnSrvc: CollectionService,
    private callNumber: CallNumber,
    ) { }

  ngOnInit() {
    this.isLoading = true
    this.activatedRoute.params.subscribe((params) => {
      ////console.log(params);
      this.deliveryInfo = params
      this.selectedDelivery =  params.dei
      this.customerEmail = params.cue
      this.customerId = params.cui
      this.selectedtime = params.det
      this.originalDate = params.ded
      this.today = params.ded
      this.invoiceNo = params.inn
      this.invoiceID = params.id
      this.currentisntruction = params.den


      let todays;
      let dd = new Date(this.originalDate).getDate();
      let mm = new Date(this.originalDate).getMonth() + 1;
      let yyyy = new Date(this.originalDate).getFullYear();
      //todays = dd + "-" + mm + "-" + yyyy
      let ddd = dd < 10 ? "0" + dd : dd
      let mmm = mm < 10 ? "0" + mm : mm
      todays = yyyy + "-" + mmm + "-" + ddd
      this.postponeDate = ddd + '-' + mmm + '-' + yyyy
      this.today = todays
      ////console.log(todays)
    });

    this.storage.get('ACCOUNTS_TABLE').then(res => {
      this.driverInfo = res
      ////console.log(this.driverInfo)
      this.isLoading = false
    })

    this.storage.get('TIMESLOT_TABLE').then(res => {
      res.forEach(element => {
        this.timeslots.push(element.description)
      });
      ////console.log(this.timeslots)
      this.selectedtime = this.selectedtime
      this.isLoading = false
    })
  }

  callNow(number) {
    if (number == "1") {
      this.callnumber = this.deliveryInfo.cn1
    } else  if (number == "2"){
      this.callnumber = this.deliveryInfo.cn2
    } else {
      this.callnumber = this.deliveryInfo.cn3
    }
    this.callNumber.callNumber(this.callnumber, true)
      .then(res =>console.log('Launched dialer!', res))
      .catch(err =>console.log('Error launching dialer', err));
  }


  getTime(selectedtime){
    ////console.log(selectedtime);
    this.selectedtime = selectedtime
  }

  createInvoiceItem(){
    this.router.navigate(['/selectcategory'], this.deliveryInfo);
  }

  makePayment(){
    this.router.navigate(['/deliverymakepayment']);
  }

  viewItems(){
    this.router.navigate(['/deliveryitemview'], this.selectedDelivery);
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      message: msg,
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();
  }

  async updateMyEmail(){
    //var validator = require("email-validator"); //need to check
    await this.presentLoading('Syncing Email Data');
    //if(validator.validate(this.customerEmail) == true){

      let params = {
        customerID: this.customerId,
        customerEmail: this.customerEmail
      }

      await Promise.resolve(this.cltnSrvc.updateEmail(this.driverInfo, this.customerEmail, this.customerId )).then(data => {
        if (data != "false") {
          this.presentAlert("Email Successfully Change");
        } else {
          this.presentAlert("Connection error");
  
          this.storage.get('UNSYNCED_EMAILS_TABLE').then(res => {
            let data
            data = res
            let filtered: any = []
            if (data != "") {
              data.forEach(unsync => {
                if (unsync.customerID == this.customerId) {
                  filtered.push(params)
                } else {
                  filtered.push(unsync)
                }
              });
              this.storage.set('UNSYNCED_EMAILS_TABLE', filtered)
            }else{
              this.storage.set('UNSYNCED_EMAILS_TABLE', params)
            }
          }).finally(() => {
            this.storage.get('UNSYNCED_EMAILS_TABLE').then(res => {
              // ////console.log(res)
            })
            
          })
        }
      }).catch(e => {
        ////console.log(e);
        this.storage.get('UNSYNCED_EMAILS_TABLE').then(res => {
          let data
          data = res
          let filtered: any = []
          if (data != "") {
            data.forEach(unsync => {
              if (unsync.customerID == this.customerId) {
                filtered.push(params)
              } else {
                filtered.push(unsync)
              }
            });
            this.storage.set('UNSYNCED_EMAILS_TABLE', filtered)
          }else{
            this.storage.set('UNSYNCED_EMAILS_TABLE', params)
          }
        }).finally(() => {
          this.storage.get('UNSYNCED_EMAILS_TABLE').then(res => {
            // ////console.log(res)
          })
        })
      });
      this.loading.dismiss();
  }

  async postphone(){
    await this.presentLoading('trying to postpone delivery');
    ////console.log(this.today)
    ////console.log(this.selectedtime)
    let selectedDate;
    let dd = new Date(this.today).getDate();
    let mm = new Date(this.today).getMonth() + 1;
    let yyyy = new Date(this.today).getFullYear();
    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm
    selectedDate = yyyy + "-" + mmm + "-" + ddd
    let selectedDate2;
    let dddd = new Date(this.today).getDate();
    let mmmm = new Date(this.today).getMonth() + 1;
    let yyyyy = new Date(this.today).getFullYear();
    let myday = dd < 10 ? "0" + dddd : dddd
    let mymonth = mm < 10 ? "0" + mmmm : mmmm
    selectedDate2 = myday + "-" + mymonth + "-" + yyyyy

    if(selectedDate == this.originalDate){
      this.presentAlert("Selected Date is the same as today. Please choose other day to postpone");
    }else{
      if(this.reasonofpostpone != ""){
      await Promise.resolve(this.delSrvc.postponeDelivery(this.driverInfo, this.today, this.selectedtime, this.selectedDelivery, this.reasonofpostpone, this.invoiceNo, this.invoiceID, this.postponeDate , this.currentisntruction)).then(data => {
        if(data != "false" || data != ""){
          this.removepostpone(this.selectedDelivery)
          this.presentAlert("Delivery Postponed to "+ selectedDate2 +  " with timing " + this.selectedtime);
          //need to check
        }else{
          this.presentAlert("Connection error");
        }
      }).catch(e => {
        ////console.log(e);
        this.presentAlert("Connection error");
      });
     }else{
      this.presentAlert("Please add reason to postpone");
     }
    }

    this.loading.dismiss();
  }

  removepostpone(collectionid){
    this.presentLoading('Removing on list');
    this.storage.get('COLDEL_TABLE').then(res => {
      let data, colid, i
      data = res
      let filtered: any = []
      // colid = res.type == 'collection' ? res.findIndex(x => x.id == res.id) : res.findIndex(x => x.dei == res.dei)
      // ////console.log(colid)
      // i = data.type == 'collection' ? data.findIndex(x => x.id == offlinedata.id) : data.findIndex(x => x.dei == offlinedata.dei)
      if (data != "") {
        data.forEach(coldelData => {
          if (coldelData.coldel_type == 'delivery') {
            if (coldelData.dei == collectionid) {
              
            } else {
              filtered.push(coldelData)
            }
          } else {
            filtered.push(coldelData)
          }
        });
        
        this.storage.set('COLDEL_TABLE', filtered)
      }
    }).finally(() => {
      this.loading.dismiss();
      this.router.navigate(['/coldev']);
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



}
