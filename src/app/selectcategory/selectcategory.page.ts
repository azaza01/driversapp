import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SelectitemlistPage } from '../selectitemlist/selectitemlist.page'



@Component({
  selector: 'app-selectcategory',
  templateUrl: './selectcategory.page.html',
  styleUrls: ['./selectcategory.page.scss'],
})

export class SelectcategoryPage implements OnInit {

  dataReturned:any;

  constructor(private router : Router,public alertController: AlertController,public modalController: ModalController) { }

  ngOnInit() {
  }

  

  createInvoiceItem(){
    this.router.navigate(['/selectitemlist']);
  }

  createcustomItem(){
    this.router.navigate(['/createcustomitem']);
  }


  confirmInvoice(){
    this.router.navigate(['/confirminvoice']);
  }

  viewCollectionItem(){
    this.router.navigate(['/collectionitems']);
  }




  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: SelectitemlistPage
  //   });
  //   return await modal.present();
  // }

  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: SelectitemlistPage,
  //     componentProps: {
  //       "paramID": 123,
  //       "paramTitle": "Test Title"
  //     }
  //   });
 
  //   modal.onDidDismiss().then((dataReturned) => {
  //     if (dataReturned !== null) {
  //       this.dataReturned = dataReturned.data;
  //       //alert('Modal Sent Data :'+ dataReturned);
  //     }
  //   });
 
  //   return await modal.present();
  // }

  // async showItem() {
  //   const alert = await this.alertController.create({
  //     header: 'ADD ITEMS',
  //     // message: 'Message',
  //     cssClass: 'ion-alertCSS',
  //     label : [{
  //       name: 'one'
  //     },],
  //     inputs: [
  //       {
  //         name: 'checkbox1',
  //         type: 'number',
  //         label: 'Checkbox 1',
  //         value: 'value1',
  //       },

  //      ],
  //     buttons: [
  //       {
  //         text: 'CANCEL',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //          //nofunction
  //         }
  //       }, {
  //         text: 'ADD',
  //         handler: () => {
  //          //function here
          
  //         }
  //       }
  //     ],
  //   });

  //   await alert.present();
  // }

}
