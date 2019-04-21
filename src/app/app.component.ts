import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  sequence,
} from '@angular/animations';
import { AuthenticationProvider } from '../providers/authentication/authentication';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = HomePage;
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private authProv: AuthenticationProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Check if there is a token currently stored in order to set the RootPage dynamically
      this.authProv.getToken().then((token) => {
        if(token) {
          console.log("Token loaded at startup: ");
          console.log(token);
          this.rootPage = HomePage;
        }
        else {
          console.log("Token expired");
          this.rootPage = LoginPage;
        }
      })
      .catch(err => {
        console.error("An error has occurred retrieving the token");
      });
    });
  }

}

