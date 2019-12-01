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

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private delcltnSrvc: DeliveryService,
    private storage: Storage,
  ) { }

  ngOnInit() {
   
  }



}
