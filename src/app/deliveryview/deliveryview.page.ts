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

  customerEmail: any
  customerId: any

  callnumber: any

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
      console.log(params);
      this.deliveryInfo = params
      this.selectedDelivery =  params.dei
      this.customerEmail = params.cue
      this.customerId = params.cui
      this.selectedtime = params.det
      this.originalDate = params.ded
      this.today = params.ded


      let todays;
      let dd = new Date(this.originalDate).getDate();
      let mm = new Date(this.originalDate).getMonth() + 1;
      let yyyy = new Date(this.originalDate).getFullYear();
      //todays = dd + "-" + mm + "-" + yyyy
      todays = yyyy + "-" + mm + "-" + dd

      this.today = todays
      console.log(todays)
    });

    this.storage.get('ACCOUNTS_TABLE').then(res => {
      this.driverInfo = res
      console.log(this.driverInfo)
      this.isLoading = false
    })

    this.storage.get('TIMESLOT_TABLE').then(res => {
      res.forEach(element => {
        this.timeslots.push(element.description)
      });
      console.log(this.timeslots)
      this.selectedtime = this.selectedtime
      this.isLoading = false
    })
  }

  callNow(number) {
    if (number == "1") {
      this.callnumber = this.deliveryInfo.cn1
    } else {
      this.callnumber = this.deliveryInfo.cn2
    }
    this.callNumber.callNumber(this.callnumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }


  getTime(selectedtime){
    console.log(selectedtime);
    this.selectedtime = selectedtime
  }

  createInvoiceItem(){
    this.router.navigate(['/selectcategory']);
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
    await this.presentLoading('');
    //if(validator.validate(this.customerEmail) == true){

      await Promise.resolve(this.cltnSrvc.updateEmail(this.accSrvc.driverData, this.customerEmail, this.customerId )).then(data => {
        if(data == true){
          this.presentAlert("Email Successfully Change");
          this.loading.dismiss();
        }else{
          this.presentAlert("Connection error");
          this.loading.dismiss();
        }
      }).catch(e => {
        console.log(e);
        this.presentAlert("Connection error");
        this.loading.dismiss();
      });
    // }else{
    //   this.presentAlert("Invalid Email! Please check.");
    //   this.loading.dismiss();
    // }
  }

  async postphone(){
    console.log(this.today)
    console.log(this.selectedtime)
    let selectedDate;
    let dd = new Date(this.today).getDate();
    let mm = new Date(this.today).getMonth() + 1;
    let yyyy = new Date(this.today).getFullYear();
    selectedDate = yyyy + "-" + mm + "-" + dd
    let selectedDate2;
    let ddd = new Date(this.today).getDate();
    let mmm = new Date(this.today).getMonth() + 1;
    let yyyyy = new Date(this.today).getFullYear();
    selectedDate2 = ddd + "-" + mmm + "-" + yyyyy


    if(selectedDate == this.originalDate){
      this.presentAlert("Selected Date is the same as today. Please choose other day to postpone");
    }else{
      if(this.reasonofpostpone != ""){
      await this.presentLoading('');
      await Promise.resolve(this.delSrvc.postponeDelivery(this.accSrvc.driverData, this.today, this.selectedtime, this.selectedDelivery, this.reasonofpostpone )).then(data => {
        if(data == true){
          this.presentAlert("Delivery Postponed to "+ selectedDate2 +  " with timing " + this.selectedtime);
          this.loading.dismiss();
          //need to check
        }else{
          this.presentAlert("Connection error");
          this.loading.dismiss();
        }
      }).catch(e => {
        console.log(e);
        this.presentAlert("Connection error");
        this.loading.dismiss();
      });
     }else{
      this.presentAlert("Please add reason to postpone");
     }
    }
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
