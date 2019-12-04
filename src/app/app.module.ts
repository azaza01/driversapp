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


@NgModule({
  declarations: [
    AppComponent, 
    ViewItemsComponent,
  ],
  entryComponents: [
    ViewItemsComponent,
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
