import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { Storage } from '@ionic/storage';
import { async } from '@angular/core/testing';
import { CallNumber } from '@ionic-native/call-number/ngx';
// import { SMS } from '@ionic-native/sms/ngx';

@Component({
  selector: 'app-colectionview',
  templateUrl: './colectionview.page.html',
  styleUrls: ['./colectionview.page.scss'],
})
export class ColectionviewPage implements OnInit {


  collectionInfo: any = []
  driverInfo: any
  isLoading: boolean = false
  unsyncData: any;
  timeslots: any = []
  selectedtime: any
  callnumber: any
  sendNumber: any
  customerName: any;

  constructor(
    private router: Router,
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute,
    private defaultSrvc: DefaultsService,
    private storage: Storage,
    private callNumber: CallNumber,
    // private sms: SMS
  ) { }

  ngOnInit() {
    this.isLoading = true
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      this.collectionInfo = params
      this.selectedtime = this.collectionInfo.cot
      this.customerName = this.collectionInfo.cun
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
      this.isLoading = false
    })

    // this.storage.get("TIMESLOT_TABLE").then(res => {
    //   var flags = [], output = [], l = res.length, i;
    //   for (i = 0; i < l; i++) {
    //     if (flags[res[i].description]) continue;
    //     flags[res[i].description] = true;
    //     output.push(res[i].description);

    //   }
    //   this.timeslots = output;
    // })

  }

  // sendMessage(number){
  //   if(number == "1"){
  //     this.sendNumber = this.collectionInfo.cn1
  //   }else{
  //     this.sendNumber = this.collectionInfo.cn2
  //   }
  //   this.sms.send(this.sendNumber, 'Dear');
  // }

  callNow(number) {
    if(number == "1"){
      this.callnumber = this.collectionInfo.cn1
    }else{
      this.callnumber = this.collectionInfo.cn2
    }
    this.callNumber.callNumber(this.callnumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  

  getTime(selectedtime){
    console.log(selectedtime);
  }

  async createInvoiceSelectItem(info) {
    console.log(this.collectionInfo)
    let tag;
    const alert = await this.alertController.create({
      header: 'Bill from which company?',
      message: 'For curtains, carpets and sofa covers, please bill from DC. For any others, please bill from CC.',
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'DC',
          handler: async () => {
            //function herer
            // console.log(this.selected);
            tag = "DC"
            // this.defaultSrvc.createInvSeries(tag)
            // this.router.navigate(['/selectcategory', this.collectionInfo]);
            Promise.resolve(this.defaultSrvc.createInvSeries(tag)).then(data => {
              console.log(data);
              let params: any = {};
              params.UNINV_COLLTS = new Date() + ''
              params.UNINV_COLLID = info.id
              params.UNINV_INVNO = data
              params.UNINV_CUSTID = info.cui
              params.UNINV_INITIAL = tag
              params.UNINV_TYPE = 'New'
              params.UNINV_DEPOAMT = '0'
              params.UNINV_DEPOTYPE = 'Cash'
              params.UNINV_BALANCE = '0'
              params.UNINV_AGREEDDELIVERYDATE = info.rtd
              params.UNINV_DELIVERYTIMESLOT = info.cot
              params.UNINV_INVOICENOTE = ''
              params.UNINV_DISCOUNT = '0'
              params.UNINV_EXPRESS = '1.00'
              params.UNINV_HASDONATE = '0'
              params.UNINV_DONATE = '0'
              params.UNINV_BAGS = '0'
              params.UNINV_SAVEDON = this.defaultSrvc.getToday()
              console.log(params)

              this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
                this.unsyncData = res
                console.log(this.unsyncData)

                if (res == null) {
                  this.unsyncData = []
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  console.log(this.unsyncData)

                } else {
                  let result;
                  result = this.unsyncData.filter((item) => {
                    return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                  })
                  if (result.length < 1) {
                    this.unsyncData.push(params)
                    this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                    console.log(this.unsyncData)

                  } else {
                    console.log(result)
                    let i;
                    i = this.unsyncData.findIndex(x => x.id == result[0].id)
                    this.unsyncData.splice(i, 1, params);
                    this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                    console.log(this.unsyncData)
                  }
                }
              }).finally(() => {
                console.log(this.unsyncData);
                this.router.navigate(['/selectcategory', info]);
              })

            }).catch(e => {
              console.log(e);
            });
          }
        }, {
          text: 'CC',
          handler: async () => {
            //function herer
            // console.log(this.selected);
            tag = "CC"
            // this.collectionInfo. = ""
            // this.defaultSrvc.createInvSeries(tag)
            Promise.resolve(this.defaultSrvc.createInvSeries(tag)).then(data => {
              console.log(data);
              let params: any = {};
              params.UNINV_COLLTS = new Date() + ''
              params.UNINV_COLLID = info.id
              params.UNINV_INVNO = data
              params.UNINV_CUSTID = info.cui
              params.UNINV_INITIAL = tag
              params.UNINV_TYPE = 'New'
              params.UNINV_DEPOAMT = '0'
              params.UNINV_DEPOTYPE = 'Cash'
              params.UNINV_BALANCE = '0'
              params.UNINV_AGREEDDELIVERYDATE = info.rtd
              params.UNINV_DELIVERYTIMESLOT = info.cot
              params.UNINV_INVOICENOTE = ''
              params.UNINV_DISCOUNT = '0'
              params.UNINV_EXPRESS = '1.00'
              params.UNINV_HASDONATE = '0'
              params.UNINV_DONATE = '0'
              params.UNINV_BAGS = '0'
              params.UNINV_SAVEDON = this.defaultSrvc.getToday()
              console.log(params)

              this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
                this.unsyncData = res
                console.log(this.unsyncData)

                if (res == null) {
                  this.unsyncData = []
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  console.log(this.unsyncData)

                } else {
                  let result;
                  result = this.unsyncData.filter((item) => {
                    return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                  })
                  if (result.length < 1) {
                    this.unsyncData.push(params)
                    this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                    console.log(this.unsyncData)

                  } else {
                    console.log(result)
                    let i;
                    i = this.unsyncData.findIndex(x => x.id == result[0].id)
                    this.unsyncData.splice(i, 1, params);
                    console.log(this.unsyncData)
                    this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  }
                }
              }).finally(() => {
                console.log(this.unsyncData);
                this.defaultSrvc.getTempItems = null
                this.router.navigate(['/selectcategory', info]);
              })

            }).catch(e => {
              console.log(e);
            });
          }
        }
      ],
    });

    await alert.present();
  }


}
