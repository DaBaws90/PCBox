import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  test:any;
  data = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProv:AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  private signUp() {
    // let data = {
    //   name: name,
    //   email: email,
    //   password: pass,
    //   password_confirmation: pass_c,
    // }

    console.log(this.data);
    this.authProv.register(this.data).then((LUL) => {
      this.test = LUL;
      console.log(this.test);
      console.log(LUL);
    })
  }

}
