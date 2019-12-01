import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { Storage } from '@ionic/storage';
import { notEqual } from 'assert';

@Component({
  selector: 'app-deliveryview',
  templateUrl: './deliveryview.page.html',
  styleUrls: ['./deliveryview.page.scss'],
})
export class DeliveryviewPage implements OnInit {

  deliveryInfo: any = []
  driverInfo: any
  isLoading: boolean = false
  unsyncData: any;

  selectedDelivery: any;

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
      this.deliveryInfo = params
      this.selectedDelivery =  params.dei
      console.log(this.selectedDelivery)
    });

    this.storage.get('ACCOUNTS_TABLE').then(res => {
      this.driverInfo = res
      console.log(this.driverInfo)
      this.isLoading = false
    })
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





}
