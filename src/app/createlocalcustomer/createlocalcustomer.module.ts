import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreatelocalcustomerPage } from './createlocalcustomer.page';

const routes: Routes = [
  {
    path: '',
    component: CreatelocalcustomerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreatelocalcustomerPage]
})
export class CreatelocalcustomerPageModule {}
