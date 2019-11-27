import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DefaultsService } from '../api/defaults.service';
import { filter } from 'minimatch';
import { ViewItemsComponent } from '../view-items/view-items.component';

@Component({
  selector: 'app-selectitemlist',
  templateUrl: './selectitemlist.page.html',
  styleUrls: ['./selectitemlist.page.scss'],
})
export class SelectitemlistPage implements OnInit {

  loading: any = new LoadingController;
  category: any
  temp_List: any
  item_List: any = []
  subtotal: any = 0;

  constructor(
    public modalController: ModalController,
    public activatedRoute: ActivatedRoute,
    private defaultSrvc: DefaultsService,
    public loadingCtrl: LoadingController,

  ) { }

  async ngOnInit() {
    console.log(this.defaultSrvc.getCategory)
    console.log(this.defaultSrvc.getTempItems)
    this.category = this.defaultSrvc.getCategory
    this.temp_List = this.defaultSrvc.getTempItems
    this.item_List = await this.getList(this.temp_List)
    console.log(this.item_List)

  }

  updateSubtotal(item){
    if(item.qty != 0){
      this.subtotal = item.qty * item.price;
      console.log(this.subtotal)
      return this.subtotal;
    }
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  async getList(data) {
    let res
    res = data
    let filtered: any = []
    await this.presentLoading('');

    res.forEach(temp => {
      if (temp.cat_type == this.category) {
        filtered.push(temp)
      }
    });

    this.loading.dismiss()
    return filtered
  }

  viewItemsX(info) {
    console.log(info)
  }

  async viewItems(info) {
    const myModal = await this.modalController.create({
      component: ViewItemsComponent,
      cssClass: 'viewItem-css',
      componentProps: { value: info },
      backdropDismiss: false,
    });

    myModal.onDidDismiss().then(data => {

      if (data['data'] != undefined) {
        console.log(data)
        this.item_List = data['data'].data
      } else {

      }

    })

    myModal.present();

  }

}
