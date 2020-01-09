import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController, AlertController} from '@ionic/angular';
import { AccountsService } from '../api/accounts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-createlocalcustomer',
  templateUrl: './createlocalcustomer.page.html',
  styleUrls: ['./createlocalcustomer.page.scss'],
})
export class CreatelocalcustomerPage implements OnInit {

  custtypelist: any = []
  selectedarea: any
  selectedcusttype: any
  arealist: any = []
  areacode: any

  description: any
  loading: any = new LoadingController;

  contactperson1: any
  contactno1: any
  mailingaddress: any
  unitno: any
  builidngname: any
  postalcode: any
  liftlobby: any
  customertype: any
  contactno2: any
  emailcus: any
  contactperson2: any
  user: NgForm

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    private accSrvc: AccountsService,
    private router: Router
  ) { }

  ngOnInit() {
   
    this.storage.get('CUSTOMERTYPE_TABLE').then(res => {
      console.log(res)
      var l = res.length, i;
      for (i = 0; i < l; i++) {
        this.custtypelist.push(res[i].description);          
      }
      console.log(this.custtypelist)
    })

  }

  async presentToast(msg) {

    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: 'medium',
      cssClass: 'customToast-class',
    });
    toast.present();
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-class'
    });
    return await this.loading.present();
  }

  setDef(user){
    if(user.value.customertype == "Self Collect"){
      user.value.postalcode = "408934"
      user.value.mailingaddress = "53 Ubi Ave 1"
      user.value.unitno = "01-29"
      user.value.builidngname = "Paya Ubi Industrial Park"
    }
  }

  getAreas(user){
    console.log(user.value.postalcode)
    let postalcode  = user.value.postalcode
    var member = postalcode.toString();
    var last2 = member.slice(0,2); 
    console.log(last2)
    this.storage.get('AREAS_TABLE').then(res => {
      console.log(res)
      var l = res.length, i;
      for (i = 0; i < l; i++) {
        if(res[i].postal_json.includes(last2) ){
          this.areacode = res[i].region
          // this.arealist.push(res[i].region)
        }  
      }
      console.log(this.areacode)
    })
  }

  async registerCustomer(user){
    console.log(user)
    this.getAreas(user)
    if(user.value.customertype == "Self Collect"){
      user.value.postalcode = user.value.postalcode == "" ? "408934" : user.value.postalcode
      user.value.mailingaddress = user.value.mailingaddress == "" ? "53 Ubi Ave 1" : user.value.mailingaddress
      user.value.unitno = user.value.unitno == "" ? "01-29" : user.value.unitno
      user.value.builidngname =  user.value.builidngname == "" ? "Paya Ubi Industrial Park" : user.value.builidngname
    }

    if (navigator.onLine == true) {
    await this.presentLoading('Creating Customer');
    Promise.resolve(this.accSrvc.addCustomerStandingOrder(user.value, this.areacode)).then(data => {

      var newdata: any = [];
      newdata.push(data);
      console.log(newdata.customerid )
      if (data != "" &&  data != false) {
        user.reset();
        this.presentToast("Successfully added")
        this.router.navigate(['/home']);
      } else {
        this.loading.dismiss();
        this.presentToast("Please check required details")
      }
      this.loading.dismiss();

    }).catch(e => {
      console.log(e);
      this.presentToast("Please type your credentials")
      this.loading.dismiss();
    });
    }else{
      this.presentToast("Please type your credentials")
      this.loading.dismiss();
    }

  }

  async asktoAdd(data){
    const alert = await this.alertController.create({
      header: 'Bill from which company?',
      message: 'For curtains, carpets and sofa covers, please bill from DC. For any others, please bill from CC.',
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            this.billfrom(data)
          }
        }, {
          text: 'No',
          handler: async () => {
            this.router.navigate(['/coldev']);
          }
        }
      ],
    });

  }
  
  async billfrom(data){
    const alert = await this.alertController.create({
      header: 'Bill from which company?',
      message: 'For curtains, carpets and sofa covers, please bill from DC. For any others, please bill from CC.',
      cssClass: 'ion-alertCSS',
      buttons: [
        {
          text: 'DC',
          handler: async () => {
          
          }
        }, {
          text: 'CC',
          handler: async () => {
            
          }
        }
      ],
    });

    await alert.present();
  }

  getCustomertype(){

  }

  getArea(areacode){
    console.log(areacode)
    
  }

}
