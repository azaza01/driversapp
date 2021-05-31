import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DefaultsService } from '../api/defaults.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss'],
})
export class ViewItemsComponent implements OnInit {

  item_List: any
  constructor(
    public params: NavParams,
    public modalCtrl: ModalController,
    private defaultSrvc: DefaultsService,
    private router: Router,
    private storage: Storage,

  ) { }

  ngOnInit() {
    // this.item_List = this.params.get('value')
    this.item_List = this.defaultSrvc.getTempItems

    ////console.log(this.item_List)
  }

  filterItems(){
    
  }

  closeModal() {
    this.modalCtrl.dismiss({
      data: this.item_List
    });
  }

  async confirmInvoice() {
    this.storage.set('TEMP_ITEMS_TABLE', this.item_List).then(() => {
      this.defaultSrvc.getTempItems = this.item_List
      this.router.navigate(['/confirminvoice']);
    })
  }

}
