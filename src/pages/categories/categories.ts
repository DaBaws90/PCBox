import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ProductsProvider } from '../../providers/products/products';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public prodsProv: ProductsProvider,
    public authProv: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  private redirectBack() {
    this.navCtrl.pop().then(() => {
      // this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot();
    });
  }

}
