import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewCanEnter() {
    // console.log('ionViewCanEnter ProfilePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillLoad() {
    this.user = this.navParams.get('user');
  }

  private redirectBack() {
    this.navCtrl.pop().then(() => {
      // this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot();
    });
  }

}
