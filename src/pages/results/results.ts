import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  productsArray:any;
  columns:any;
  rows:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.columns = [
      { prop: 'codigo' },
      { name: 'nombre' },
      { name: 'precio' },
      { name: 'precioPccomp'},
      { name: 'enlace' },
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultsPage');
  }

  ionViewWillLoad() {
    this.productsArray = this.navParams.get('productsArray');
    this.rows = this.productsArray['products'];
    console.warn(this.productsArray['products']);
  }

}
