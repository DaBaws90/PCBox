import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthenticationProvider, 
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // Manages the LogIn HTTP request
  private logIn(){
    // Present a spinner on method's call
    const spinner = this.authProvider.spinner();
    spinner.present();
    // Calls the AuthProvider's method to manage the login request
    this.authProvider.login(this.data).then((res) => {
      // Set HomePage as root
      this.navCtrl.setRoot(HomePage);
      // Navigates to HomePage
      this.navCtrl.popToRoot(this.authProvider.transitionOpts);
      console.log("Brownsing to HomePage");
    })
    // Handles errors at login's request
    .catch(error => {
      spinner.dismiss();
      console.error("There was an error from HTTP request at LogIn AuthProvider's method");
      console.error(error);
    });
  }

  // Set remember_me value on checkbox's click
  private setRemember() {
    this.data.remember_me = !this.data.remember_me;
  }

  // Navigates to RegisterPage
  private goToRegister() {
    this.navCtrl.push(RegisterPage, {}, this.authProvider.transitionOpts);
  }

}
