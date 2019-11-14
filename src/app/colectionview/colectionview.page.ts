import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
 
@Component({
  selector: 'app-colectionview',
  templateUrl: './colectionview.page.html',
  styleUrls: ['./colectionview.page.scss'],
})
export class ColectionviewPage implements OnInit {

  constructor(private router : Router, public alertController: AlertController) { }

  ngOnInit() {
  }

  createInvoiceItem(){
    this.router.navigate(['/selectcategory']);
  }





}
