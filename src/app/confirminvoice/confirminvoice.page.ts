import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-confirminvoice',
  templateUrl: './confirminvoice.page.html',
  styleUrls: ['./confirminvoice.page.scss'],
})
export class ConfirminvoicePage implements OnInit {

  customerData: any
  isLoading: boolean = false

  constructor(
    private storage: Storage,

  ) { }

  ngOnInit() {
    this.isLoading = true
    this.storage.get('UNSYNCED_INVOICE_TABLE').then(res => {
      console.log(res)
      this.customerData = res[0]
      this.isLoading = false
    })
  }

  makePayment(){

  }

  viewItems(){

  }

}
