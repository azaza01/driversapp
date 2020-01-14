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

  goToHome(){
    this.router.navigate(['/home']);
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

  setDef(propertytype){
    console.log(propertytype)
    if(propertytype== "Self Collect"){
      this.postalcode = "408934"
      this.mailingaddress = "53 Ubi Ave 1"
      this.unitno = "01-29"
      this.builidngname = "Paya Ubi Industrial Park"
      this.getAreas("408934")
    }else {
      this.postalcode = ""
      this.mailingaddress = ""
      this.unitno = ""
      this.builidngname = ""
      this.areacode = ""
      this.postalcode = ""
    }
  }

  getAreas(postal){
    console.log(postal)
    if(postal != ""){
      let mypostalcode  = postal
      var member = mypostalcode.toString();
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
    }else{
      this.areacode = ""
    }

  }

  async registerCustomer(){
    // console.log(user)
    // this.getAreas(user)
    // if(user.value.customertype == "Self Collect"){
    //   user.value.postalcode = user.value.postalcode == "" ? "408934" : user.value.postalcode
    //   user.value.mailingaddress = user.value.mailingaddress == "" ? "53 Ubi Ave 1" : user.value.mailingaddress
    //   user.value.unitno = user.value.unitno == "" ? "01-29" : user.value.unitno
    //   user.value.builidngname =  user.value.builidngname == "" ? "Paya Ubi Industrial Park" : user.value.builidngname
    // }

    let params = {
      contactperson1 : this.contactperson1,
      contactno1: this.contactno1,
      mailingaddress: this.mailingaddress,
      unitno: this.unitno,
      builidngname: this.builidngname,
      postalcode: this.postalcode,
      liftlobby: this.liftlobby,
      customertype: this.customertype,
      contactno2: this.contactno2,
      emailcus: this.emailcus,
      contactperson2: this.contactperson2,
      areacode: this.areacode
    }

    console.log(params)
    if((this.contactperson1 != "" && this.contactno1 != "" && this.mailingaddress != "" && this.postalcode != "") && (this.contactperson1 != undefined && this.contactno1 != undefined && this.mailingaddress != undefined && this.postalcode != undefined )){
      if (navigator.onLine == true) {
        await this.presentLoading('Creating Customer');
        Promise.resolve(this.accSrvc.addCustomerStandingOrder(params)).then(data => {
    
          var newdata: any = [];
          newdata.push(data);
          console.log(newdata.customerid )
          if (data != "" &&  data != false) {
            this.resetdata();
            this.presentToast("Successfully added")
            this.router.navigate(['/home']);
          } else {
            this.loading.dismiss();
            this.presentToast("Please check required details")
          }
          this.loading.dismiss();
    
        }).catch(e => {
          console.log(e);
          this.presentToast("No internet connection")
          this.loading.dismiss();
        });
        }else{
          this.presentToast("No internet connection")
          this.loading.dismiss();
        }
    
    }else{
      this.presentToast("Please check required details")
    }


    
   
  }

  resetdata(){
    this.areacode = ""  
    this.contactperson1= ""  
    this.contactno1= ""  
    this.mailingaddress= ""  
    this.unitno= ""  
    this.builidngname= ""  
    this.postalcode= ""  
    this.liftlobby= ""  
    this.contactno2= ""  
    this.emailcus= ""  
    this.contactperson2= ""  
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

  // getArea(areacode){
  //   this.areacode = areacode
  //   console.log(areacode)
    
  // }

}
