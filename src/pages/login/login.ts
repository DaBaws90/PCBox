import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

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
  test:any;
  user:any;
  data = {
    email: "",
    password: "",
    remember_me: true,
  }; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private logIn(){
    this.authProvider.getToken();
    // this.authProvider.login(this.data).then((res) => {
    //   // DO SOMETHING
    //   this.test = res;
    //   console.log(this.test);
    // });
  }

  private setRemember() {
    this.data.remember_me = !this.data.remember_me;
    console.log("REMEMBER ME? -> " + this.data.remember_me);
  }

  private goToRegister() {
    const transitionOpts = {
      animation: 'md-transition',
      duration: 1000,
    };

    this.navCtrl.push(RegisterPage, {}, transitionOpts);
  }

}
