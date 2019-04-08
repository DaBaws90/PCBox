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
    password: ""
  }; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private logIn(){
    
    this.authProvider.login(this.data).then((LEL) => {
      // DO SOMETHING
      this.test = LEL;
      console.log(this.test);
    });
  }

  private goToRegister() {
    const transitionOpts = {
      animation: 'md-transition',
      duration: 1000,
    };

    this.navCtrl.push(RegisterPage, {}, transitionOpts);
  }

}
