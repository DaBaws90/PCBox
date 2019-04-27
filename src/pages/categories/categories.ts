import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ProductsProvider } from '../../providers/products/products';
import { ResultsPage } from '../results/results';
import { LoginPage } from '../login/login';

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

  categoriesArray:any;

  data = {
    category: 0,
    keyword: "",
    keyword1: "",
    comparison: "",
    percentage: null,
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public prodsProv: ProductsProvider,
    public authProv: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  ionViewWillLoad() {
    this.categoriesArray = this.navParams.get('categories');
  }

  private categories() {
    this.authProv.getToken().then(token => {
      if(token !== null) {
        this.prodsProv.categoriesSearch(this.data).then(response => {
          console.info(response);
          this.navCtrl.push( ResultsPage, {'productsArray': response}, this.authProv.transitionOpts )
        })
        .catch(err => {
          console.error(err);
          let tmp = this.authProv.errorHandler(err);
          this.authProv.displayToast(tmp);
        })
      }
      else {
        this.loginRedirect();
      }
    })
    .catch(err => {
      console.error(err);
      let tmp = this.authProv.errorHandler(err);
      this.authProv.displayToast(tmp);
    })
  }

  private setComparison(event:any) {
    this.data.comparison = event;
  }

  // Sets LoginPage as RootPage and displays a message (Session expired). Finally, redirects to LoginPage
  private loginRedirect() {
    this.authProv.displayToast();
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

  private redirectBack() {
    this.navCtrl.pop().then(() => {
      // this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot();
    });
  }

}
