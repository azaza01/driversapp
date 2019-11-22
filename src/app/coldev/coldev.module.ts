import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ColdevPage } from './coldev.page';
import { FilterItems } from '../pipe/filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: ColdevPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ColdevPage,
    FilterItems
  ]
})
export class ColdevPageModule {}
