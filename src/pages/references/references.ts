import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductsProvider } from '../../providers/products/products';

/**
 * Generated class for the ReferencesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-references',
  templateUrl: 'references.html',
})
export class ReferencesPage {
  data = {
    references: "",
  }

  products:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public prodsProv: ProductsProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferencesPage');
  }

  private references() {
    console.info(this.data.references);
    this.prodsProv.referencesSearch(this.data).then(response => {
      this.products = response;
      console.info(response);
    })
    .catch(err => {
      console.error(err);
    })
  }

}
