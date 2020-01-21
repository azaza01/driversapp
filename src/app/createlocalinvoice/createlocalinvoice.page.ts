import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AccountsService } from '../api/accounts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultsService } from '../api/defaults.service';

@Component({
  selector: 'app-createlocalinvoice',
  templateUrl: './createlocalinvoice.page.html',
  styleUrls: ['./createlocalinvoice.page.scss'],
})
export class CreatelocalinvoicePage implements OnInit {

  loading: any = new LoadingController;
  customerlist: any = []
  mySpecialID: any
  todaydate: any
  unsyncData: any
  unsyncDataCollection: any
  customerDetails: any
  driverData: any

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    private accSrvc: AccountsService,
    private router: Router,
    private defaultSrvc: DefaultsService
  ) { }

  ngOnInit() {
    this.mySpecialID = ""
    this.storage.get('ACCOUNTS_TABLE').then(res => {
      this.driverData = res
    })
    this.getToday()
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  getToday() {
    let today;
    let todays;
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();
    let hr = new Date().getHours();
    let min = new Date().getMinutes();
    let ss = new Date().getSeconds();
    let yy = (yyyy + '').substr(2, 2);

    let ddd = dd < 10 ? "0" + dd : dd
    let mmm = mm < 10 ? "0" + mm : mm
    let hhr = hr < 10 ? "0" + hr : hr
    let mmin = min < 10 ? "0" + min : min
    let sss = ss < 10 ? "0" + ss : ss

    today = yyyy + '-' + mmm + '-' + ddd + " " + hhr + ":" + mmin + ":" + sss;
    todays = yyyy + '-' + mmm + '-' + ddd;
    this.todaydate = todays

    this.mySpecialID = today
    return today
    // ////console.log(this.todaydate)
  }

  async presentToast(msg) {

    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: 'medium',
      cssClass: 'customToast-class',
    });
    toast.present();
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }


  async getCustomer(user: NgForm) {
    ////console.log(user)

    if (navigator.onLine == true) {
      await this.presentLoading('Searching Customer');
      Promise.resolve(this.accSrvc.getCustomer(user.value)).then(data => {
        ////console.log(data)
        this.customerlist = data
        if (data == "") {
          this.presentToast("No customer found!")
        }
        this.loading.dismiss();

      }).catch(e => {
        ////console.log(e);
        this.presentToast("Please type your credentials")
        this.loading.dismiss();
      });
    } else {
      this.presentToast("Please type your credentials")
      this.loading.dismiss();
    }

  }

  async selectCus(custlist) {
    console.log(custlist)

    let paramsselected: any = {
      id: this.mySpecialID,
      cui: custlist.id,
      aid: custlist.account_id,
      cod: this.todaydate,
      ren: custlist.region,
      cot: 'A 10 - 12pm',
      cun: custlist.name,
      cut: custlist.customer_type,
      com: custlist.account_id,
      na2: custlist.name2,
      coa: custlist.mail_address,
      cob: custlist.building,
      lil: custlist.lift_lobby,
      cuo: custlist.unit_no,
      cue: custlist.email_address,
      rtd: "0000-00-00",
      rtt: "A 10 - 12pm",
      cpc: custlist.postal_code,
      cn1: custlist.contact_no1,
      cn2: custlist.contact_no2,
      cca: custlist.credit_amount,
      col: "Laundry",
      coldel_type: "collection",
      coldel_return: 'nil',
    }

    this.customerDetails = custlist
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
            // ////console.log(this.selected);
            tag = "DC"
            // this.defaultSrvc.createInvSeries(tag)
            // this.router.navigate(['/selectcategory', this.collectionInfo]);
            // Promise.resolve(this.defaultSrvc.createInvSeries(tag, this.collectionId)).then(data => {
            //   ////console.log(data);
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialID
            params.UNINV_COLLID = this.mySpecialID
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = custlist.id
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = 'New'
            params.UNINV_DEPOAMT = '0'
            params.UNINV_DEPOTYPE = 'Cash'
            params.UNINV_BALANCE = '0'
            params.UNINV_AGREEDDELIVERYDATE = '0000-00-00'
            params.UNINV_DELIVERYTIMESLOT = 'A 10 - 12pm'
            params.UNINV_INVOICENOTE = ''
            params.UNINV_DISCOUNT = '0'
            params.UNINV_EXPRESS = '1.00'
            params.UNINV_HASDONATE = '0'
            params.UNINV_DONATE = '0'
            params.UNINV_BAGS = '0'
            params.drvna = '0'
            params.drvpa = '0'
            params.drvem = '0'
            params.colitem = '0'
            params.UNINV_SAVEDON = this.todaydate
            params.syncserver = "false"
            // params.customerCredit = custlist.credit_amount
            params.driversId = this.driverData.id
            params.invoicesynctype = 'NewandAnother'
            ////console.log(params)

            await this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              ////console.log(this.unsyncData)

              if (res == null) {
                this.unsyncData = []
                this.unsyncData.push(params)
                this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                // ////console.log(this.unsyncData)

              } else {
                let result;
                result = this.unsyncData.filter((item) => {
                  return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                })
                if (result.length < 1) {
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // ////console.log(this.unsyncData)

                } else {
                  // ////console.log(result)
                  let i;
                  i = this.unsyncData.findIndex(x => x.id == result[0].id)
                  this.unsyncData.splice(i, 1, params);
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // ////console.log(this.unsyncData)
                }
              }
            }).finally(() => {
              // ////console.log(this.unsyncData);
              // this.checkIfRepeat = "yes";
              // Promise.resolve(this.deliveryndata()).then(coldata => {
              // this.savePay(coldata);
              // })

              let params: any = {}
              params.rid = this.mySpecialID
              params.coldelID = this.mySpecialID
              params.custID = custlist.id
              params.accID = custlist.account_id
              params.credit = custlist.credit_amount
              params.invoiceno = ""
              params.invoicetype = "New"
              params.invcompany = tag

              params.UCOtimestamp = "UCOtimestamp" //new UCO will be generated in the collection loop if necessary
              params.UCOcusttype = custlist.customer_type //30-11-2012 for checking minimum
              params.UCOcollecttype = paramsselected.col
              params.UCOcollectdate = this.defaultSrvc.getToday()
              params.UCOcollecttime = "A 10 - 12pm"
              params.UCOcollectaddress = custlist.mail_address
              params.UCOcollectunit = custlist.unit_no
              params.UCOcollectpostal = custlist.postal_code
              params.UCOcollectbuilding = custlist.building
              params.UCOcollectregion = custlist.region
              params.UCOcollectnote = ""
              params.UCOcollectstatus = "collected"
              params.UCOreturndate = "0000-00-00"
              params.UCOreturntime = "A 10 - 12pm"
              params.done = "A 10 - 12pm"
              params.syncserver = "false"
              params.driversId = this.driverData.id
              params.invoicesynctype = 'NewandAnother'

              // this.storage.set('UNSYNCOLLECTIONLOCAL', params).then( datas => {
              this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
                this.unsyncDataCollection = res
                // ////console.log(this.unsyncData)

                if (res == null) {
                  this.unsyncDataCollection = []
                  this.unsyncDataCollection.push(params)
                  this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                  // ////console.log(this.unsyncData)

                } else {
                  let result;
                  result = this.unsyncDataCollection.filter((item) => {
                    return (item.rid.indexOf(params.rid) !== -1)
                  })
                  if (result.length < 1) {
                    this.unsyncDataCollection.push(params)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    // ////console.log(this.unsyncData)

                  } else {
                    // ////console.log(result)
                    let i;
                    i = this.unsyncDataCollection.findIndex(x => x.id == result[0].id)
                    this.unsyncDataCollection.splice(i, 1, params);
                    // ////console.log(this.unsyncData)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                  }
                }
              }).finally(() => {
                this.storage.set('SELECTED_ITEM', paramsselected)
                this.router.navigate(['/selectcategory', paramsselected]);
              })
              // })
            })

            // }).catch(e => {
            //   ////console.log(e);
            // });
          }
        }, {
          text: 'CC',
          handler: async () => {
            tag = "CC"
            let params: any = {};
            params.UNINV_COLLTS = this.mySpecialID
            params.UNINV_COLLID = this.mySpecialID
            params.UNINV_INVNO = ""
            params.UNINV_CUSTID = custlist.id
            params.UNINV_INITIAL = tag
            params.UNINV_TYPE = 'New'
            params.UNINV_DEPOAMT = '0'
            params.UNINV_DEPOTYPE = 'Cash'
            params.UNINV_BALANCE = '0'
            params.UNINV_AGREEDDELIVERYDATE = '0000-00-00'
            params.UNINV_DELIVERYTIMESLOT = 'A 10 - 12pm'
            params.UNINV_INVOICENOTE = ''
            params.UNINV_DISCOUNT = '0'
            params.UNINV_EXPRESS = '1.00'
            params.UNINV_HASDONATE = '0'
            params.UNINV_DONATE = '0'
            params.UNINV_BAGS = '0'
            params.drvna = '0'
            params.drvpa = '0'
            params.drvem = '0'
            params.colitem = '0'
            params.UNINV_SAVEDON = this.todaydate
            params.syncserver = "false"
            // params.customerCredit = custlist.credit_amount
            params.driversId = this.driverData.id
            params.invoicesynctype = 'NewandAnother'
            ////console.log(params)

            await this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
              this.unsyncData = res
              ////console.log(this.unsyncData)

              if (res == null) {
                this.unsyncData = []
                this.unsyncData.push(params)
                this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                // ////console.log(this.unsyncData)

              } else {
                let result;
                result = this.unsyncData.filter((item) => {
                  return (item.UNINV_COLLID.indexOf(params.UNINV_COLLID) !== -1)
                })
                if (result.length < 1) {
                  this.unsyncData.push(params)
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // ////console.log(this.unsyncData)

                } else {
                  // ////console.log(result)
                  let i;
                  i = this.unsyncData.findIndex(x => x.id == result[0].id)
                  this.unsyncData.splice(i, 1, params);
                  this.storage.set('UNSYNCED_INVOICE_TABLE', this.unsyncData)
                  // ////console.log(this.unsyncData)
                }
              }
            }).finally(() => {
              // ////console.log(this.unsyncData);
              // this.checkIfRepeat = "yes";
              // Promise.resolve(this.deliveryndata()).then(coldata => {
              // this.savePay(coldata);
              // })

              let params: any = {}
              params.rid = this.mySpecialID,
                params.coldelID = this.mySpecialID,
                params.custID = custlist.id,
                params.accID = custlist.account_id,
                params.credit = custlist.credit_amount,
                params.invoiceno = "",
                params.invoicetype = "New",
                params.invcompany = tag,

                params.UCOtimestamp = this.mySpecialID, //new UCO will be generated in the collection loop if necessary
                params.UCOcusttype = custlist.customer_type, //30-11-2012 for checking minimum
                params.UCOcollecttype = paramsselected.col,
                params.UCOcollectdate = this.defaultSrvc.getToday(),
                params.UCOcollecttime = "A 10 - 12pm",
                params.UCOcollectaddress = custlist.mail_address,
                params.UCOcollectunit = custlist.unit_no,
                params.UCOcollectpostal = custlist.postal_code,
                params.UCOcollectbuilding = custlist.building,
                params.UCOcollectregion = custlist.region,
                params.UCOcollectnote = "",
                params.UCOcollectstatus = "collected",
                params.UCOreturndate = "0000-00-00",
                params.UCOreturntime = "A 10 - 12pm"
              params.done = "A 10 - 12pm"
              params.syncserver = "false"
              params.driversId = this.driverData.id
              params.invoicesynctype = 'NewandAnother'

              // this.storage.set('UNSYNCOLLECTIONLOCAL', params).then( datas => {
              this.storage.get('UNSYNCOLLECTIONLOCAL').then(res => {
                this.unsyncDataCollection = res
                // ////console.log(this.unsyncData)

                if (res == null) {
                  this.unsyncDataCollection = []
                  this.unsyncDataCollection.push(params)
                  this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                  // ////console.log(this.unsyncData)

                } else {
                  let result;
                  result = this.unsyncDataCollection.filter((item) => {
                    return (item.rid.indexOf(params.rid) !== -1)
                  })
                  if (result.length < 1) {
                    this.unsyncDataCollection.push(params)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                    // ////console.log(this.unsyncData)

                  } else {
                    // ////console.log(result)
                    let i;
                    i = this.unsyncDataCollection.findIndex(x => x.id == result[0].id)
                    this.unsyncDataCollection.splice(i, 1, params);
                    // ////console.log(this.unsyncData)
                    this.storage.set('UNSYNCOLLECTIONLOCAL', this.unsyncDataCollection)
                  }
                }
              }).finally(() => {
                this.storage.set('SELECTED_ITEM', paramsselected)
                this.router.navigate(['/selectcategory', paramsselected]);
              })
              // })
            })

            // }).catch(e => {
            //   ////console.log(e);
            // });
          }
        }
      ],
    });

    await alert.present();

  }

}
