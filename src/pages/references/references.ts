import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductsProvider } from '../../providers/products/products';
import { ResultsPage } from '../results/results';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public prodsProv: ProductsProvider,
    public authProv: AuthenticationProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferencesPage');
  }

  private references() {
    this.authProv.getToken().then(token => {
      if(token !== null) {
        this.prodsProv.referencesSearch(this.data).then(response => {
          console.info(response);
          this.navCtrl.push( ResultsPage, {'productsArray': response}, this.authProv.transitionOpts )
            // .then(() => this.navCtrl.setRoot(ReferencesPage))
            // .catch(err => console.error(err));
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
