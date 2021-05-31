import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { ViewItemsComponent } from './view-items/view-items.component';
import { Network } from '@ionic-native/network/ngx';
import { DatePipe } from '@angular/common';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { CollectionitemsPage } from './collectionitems/collectionitems.page';
import { CreatecustomitemPage } from './createcustomitem/createcustomitem.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
// import { SMS } from '@ionic-native/sms/';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import { OneSignal } from '@ionic-native/onesignal/ngx';



@NgModule({
  declarations: [
    AppComponent, 
    ViewItemsComponent,
    CollectionitemsPage,
    CreatecustomitemPage
  ],
  entryComponents: [
    ViewItemsComponent,
    CollectionitemsPage,
    CreatecustomitemPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    Ionic4DatepickerModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    // SMS,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    DatePipe,
    SocialSharing,
    // SMS,
    AndroidPermissions,
    // OneSignal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
