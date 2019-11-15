import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'coldev', loadChildren: './coldev/coldev.module#ColdevPageModule' },
  { path: 'colectionview', loadChildren: './colectionview/colectionview.module#ColectionviewPageModule' },
  { path: 'deliveryview', loadChildren: './deliveryview/deliveryview.module#DeliveryviewPageModule' },
  { path: 'selectitemlist', loadChildren: './selectitemlist/selectitemlist.module#SelectitemlistPageModule' },
  { path: 'selectcategory', loadChildren: './selectcategory/selectcategory.module#SelectcategoryPageModule' },
  { path: 'deliverymakepayment', loadChildren: './deliverymakepayment/deliverymakepayment.module#DeliverymakepaymentPageModule' },
  { path: 'deliveryitemview', loadChildren: './deliveryitemview/deliveryitemview.module#DeliveryitemviewPageModule' },
  { path: 'confirminvoice', loadChildren: './confirminvoice/confirminvoice.module#ConfirminvoicePageModule' },
  { path: 'collectionitems', loadChildren: './collectionitems/collectionitems.module#CollectionitemsPageModule' },
  { path: 'createcustomitem', loadChildren: './createcustomitem/createcustomitem.module#CreatecustomitemPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
