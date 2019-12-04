import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { Storage } from '@ionic/storage';
import { async } from '@angular/core/testing';

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
  timeslots: any

  constructor(
    private router: Router,
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute,
    private defaultSrvc: DefaultsService,
    private storage: Storage,

  ) { }

  ngOnInit() {
    this.isLoading = true
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      this.collectionInfo = params
    });

    this.storage.get('ACCOUNTS_TABLE').then(res => {
      this.driverInfo = res
      console.log(this.driverInfo)
      this.isLoading = false
    })

    this.storage.get('TIMESLOT_TABLE').then(res => {
      this.timeslots = res
      console.log(res.description)
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
              params.UNINV_AGREEDDELIVERYDATE = info.cod
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
              params.UNINV_AGREEDDELIVERYDATE = info.cod
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
