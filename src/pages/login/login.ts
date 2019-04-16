import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  data = {
    email: "",
    password: "",
    remember_me: true,
  };

  transitionOpts = {
    animation: 'md-transition',
    duration: 1000,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private logIn(){
    console.log(this.data);
    this.authProvider.login(this.data).then((res) => {
      // DO SOMETHING
      console.log(res);
      if (res['name'] === "HttpErrorResponse") {
        console.error("There was an error");
        console.error(res);
      }
      else {
        console.log("BROWSING to ROOT PAGE");
        this.navCtrl.push(HomePage, {}, this.transitionOpts);
      }
    });
  }

  private setRemember() {
    this.data.remember_me = !this.data.remember_me;
    console.log("REMEMBER ME? -> " + this.data.remember_me);
  }

  private goToRegister() {
    this.navCtrl.push(RegisterPage, {}, this.transitionOpts);
  }

}
