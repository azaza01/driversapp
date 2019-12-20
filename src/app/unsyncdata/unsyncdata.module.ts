import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UnsyncdataPage } from './unsyncdata.page';

const routes: Routes = [
  {
    path: '',
    component: UnsyncdataPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UnsyncdataPage]
})
export class UnsyncdataPageModule {}
