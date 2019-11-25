import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

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

  ) { }

  ngOnInit() {
    this.item_List = this.params.get('value')
    console.log(this.item_List)
  }

  filterItems(){
    
  }

  closeModal() {
    this.modalCtrl.dismiss({
      data: this.item_List
    });
  }

}
