import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-selectitemlist',
  templateUrl: './selectitemlist.page.html',
  styleUrls: ['./selectitemlist.page.scss'],
})
export class SelectitemlistPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

}
