import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { ProductsProvider } from '../../providers/products/products';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public authProvider: AuthenticationProvider, private prodsProvider: ProductsProvider ) {

  }

  logout() {
    this.authProvider.logout().then(() => {
      // SOLUCIONAR DYNAMIC ROOT PAGE WHILE APP IS RUNNING
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popToRoot();

    }).catch(err => {
      console.error(err);
    });
  }

  profile() {
    this.authProvider.getUserInfo().then((user) => {
      console.info("User retrieved");
      console.log(user);
      // Redirects to user's profile page
      this.navCtrl.push(ProfilePage, {'user': user}, this.authProvider.transitionOpts);
    }).catch(error => {
      console.error("Error at getUserInfo's AuthProvider method");
      console.error(error);
    })
  }

  indexPage() {
    this.prodsProvider.productsIndex().then(data => {
      console.info("Categories retrieved:");
      console.log(data);
      // Redirects to X page
      
    })
    .catch(err => {
      console.error("Error at productsIndex ProdsProvider's method");
      console.error(err);
    });
  }
}
