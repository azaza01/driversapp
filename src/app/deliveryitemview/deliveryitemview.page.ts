import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeliveryService } from '../api/delivery.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-deliveryitemview',
  templateUrl: './deliveryitemview.page.html',
  styleUrls: ['./deliveryitemview.page.scss'],
})
export class DeliveryitemviewPage implements OnInit {

  selectedDelivery : any;
  items: any = [];
  info: any

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private delcltnSrvc: DeliveryService,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.getItems(this.info);
  }

//display item with 

  getItems(info) {
    Promise.resolve(this.delcltnSrvc.gettems(info)).then(data => {
      let items: any
      items = data;
      this.info = data;
      console.log(items);
    }).catch(e => {
      console.log(e);

    });
  }

}
