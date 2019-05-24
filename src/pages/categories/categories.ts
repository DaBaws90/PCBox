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
    // Gets categoriesLit passed as param on push nav
    this.categoriesArray = this.navParams.get('categories');
  }

  // Manages the categoriesSearch HTTP request
  private categories() {
    // Present a spinner on method's call
    const spinner = this.authProv.spinner();
    spinner.present();
    // Check if token is still valid
    this.authProv.getToken().then(token => {
      if(token) {
        // Calls the ProdutsProvider's method to manage the categoriesSearch request
        this.prodsProv.categoriesSearch(this.data).then(response => {
          // console.info(response);
          // Navigates to ResultsPage
          this.navCtrl.push( ResultsPage, {'productsArray': response}, this.authProv.transitionOpts )
        })
        // Handles errors at register's request
        .catch(err => {
          spinner.dismiss();
          // Send error response to ErrorHandler method and returns a formatted string. Then, displays the string with a toast
          console.error(err);
          let tmp = this.authProv.errorHandler(err);
          this.authProv.displayToast(tmp);
        })
      }
      else {
        // Token's value is null, so session has already expired => Redirects to LoginPage
        this.loginRedirect();
      }
    })
    // Handles errors on token retrieving
    .catch(err => {
      spinner.dismiss();
      // Send error response to ErrorHandler method and returns a formatted string. Then, displays the string with a toast
      console.error(err);
      let tmp = this.authProv.errorHandler(err);
      this.authProv.displayToast(tmp);
    })
  }

  // Sets comparison value on input radio select
  private setComparison(event:any) {
    this.data.comparison = event;
  }

  // Sets LoginPage as RootPage and displays a message (Session expired). Finally, redirects to LoginPage
  private loginRedirect() {
    this.authProv.displayToast();
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

  // Replaces back button functionality to avoid some weird malfunctioning (I don't know why though)
  private redirectBack() {
    this.navCtrl.pop().then(() => {
      // this.navCtrl.popToRoot();
    });
  }

}
