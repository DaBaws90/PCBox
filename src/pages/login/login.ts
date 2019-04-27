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
    remember_me: false,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private logIn(){
    // this.pressed = !this.pressed;
    this.authProvider.login(this.data).then((res) => {
      /* 
        Cuando obtenga el resultado, llamamos al dismiss del spinner y continuamos con la ejecucion. 
        Re-habilitamos botón de login, por si datos fueron errones
      */
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot(this.authProvider.transitionOpts);
      console.log("Brownsing to HomePage");
    })
    .catch(error => {
      console.error("There was an error from HTTP request at LogIn AuthProvider's method");
      console.error(error);
    });
  }

  private setRemember() {
    this.data.remember_me = !this.data.remember_me;
    console.log("REMEMBER ME? -> " + this.data.remember_me);
  }

  private goToRegister() {
    this.navCtrl.push(RegisterPage, {}, this.authProvider.transitionOpts);
  }

}
