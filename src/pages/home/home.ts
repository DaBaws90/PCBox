import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public authProvider: AuthenticationProvider) {

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
      this.navCtrl.push(ProfilePage, {'user': user}, this.authProvider.transitionOpts);
    }).catch(error => {
      console.error("An error occurred");
      console.error(error);
    })
  }
}
