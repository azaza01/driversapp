import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
 
@Component({
  selector: 'app-colectionview',
  templateUrl: './colectionview.page.html',
  styleUrls: ['./colectionview.page.scss'],
})
export class ColectionviewPage implements OnInit {

  constructor(
    private router : Router, 
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute

    ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
    });

  }

  createInvoiceSelectItem(){
    this.router.navigate(['/selectcategory']);
  }





}
