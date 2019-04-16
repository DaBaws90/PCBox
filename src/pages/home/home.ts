import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public authProvider: AuthenticationProvider) {

  }

  logout() {
    this.authProvider.logout().then((data) => {
      // if(data['name'] === 'HttpErrorResponse') {
      //   console.error('Houston, we got a situation');
      //   this.navCtrl.popToRoot();
      // }
      // else {
      //   if(data['message'])
      //     console.log(data['message'])
      // }
      this.navCtrl.popToRoot();
    });
  }
}
