import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreatelocalinvoicePage } from './createlocalinvoice.page';

const routes: Routes = [
  {
    path: '',
    component: CreatelocalinvoicePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreatelocalinvoicePage]
})
export class CreatelocalinvoicePageModule {}
