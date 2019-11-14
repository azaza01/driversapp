import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeliveryitemviewPage } from './deliveryitemview.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryitemviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DeliveryitemviewPage]
})
export class DeliveryitemviewPageModule {}
