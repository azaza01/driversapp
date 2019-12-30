import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-driversummary',
  templateUrl: './driversummary.page.html',
  styleUrls: ['./driversummary.page.scss'],
})
export class DriversummaryPage implements OnInit {

  loading: any = new LoadingController;
  summarydata: any = []

  constructor(
    private storage: Storage,
    public loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    await this.presentLoading('Checking Deliveries and Collection Summary');
    this.storage.get('DRIVER_SUMMARY').then(res => {
      let data
      data = res
      if (data != "") {
        this.summarydata.push(data)
        this.loading.dismiss();
      }else{
        let params: any = {
          colNum: "0",
          delNum: "0",
          repeatNum: "0",
          tripNum: "0",
          cashno: "0",
          cashtotal: "0",
          chequeno: "0",
          chequetotal: "0",
          creditno: "0",
          creditotoal: "0",
          banktransferno: "0",
          banktransfertotal: "0",
          ccamount: "0",
          dcamount: "0",
          totalamount: "0",
          summarydate: "0"
        }
        this.summarydata.push(params)
        this.storage.set('DRIVER_SUMMARY', params)
      }
      this.loading.dismiss();
      console.log(this.summarydata)
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

  // colNum = (TextView)findViewById(R.id.DS_collectionnum_tv);
  //       delNum = (TextView)findViewById(R.id.DS_deliverynum_tv);
  //       repeatNum = (TextView)findViewById(R.id.DS_repeatnum_tv);
  //       tripNum = (TextView)findViewById(R.id.DS_tripnum_tv);
  //       cash = (TextView)findViewById(R.id.DS_cashamount_tv);
  //       cheque = (TextView)findViewById(R.id.DS_chequeamount_tv);
  //       credit = (TextView)findViewById(R.id.DS_creditamount_tv);
  //       banktransfer = (TextView)findViewById(R.id.DS_banktransferamount_tv);
  //       ccamount = (TextView)findViewById(R.id.DS_ccamount_tv);
  //       dcamount = (TextView)findViewById(R.id.DS_dcamount_tv);
  //       totalamount = (TextView)findViewById(R.id.DS_totalamount_tv);
  //       summarydate = (TextView)findViewById(R.id.DS_summarydate_tv);

}
