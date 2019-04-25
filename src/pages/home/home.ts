import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { ProductsProvider } from '../../providers/products/products';

import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ReferencesPage } from '../references/references';
import { CategoriesPage } from '../categories/categories';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public authProvider: AuthenticationProvider, private prodsProvider: ProductsProvider,
    public safariCtrl: SafariViewController, public inAppBrowser: InAppBrowser, private platform: Platform) {

  }

  ionViewWillLoad() {
    // this.navCtrl.setRoot(HomePage);
  }

  logout() {
    this.authProvider.logout().then(() => {
      // Sets LoginPage as RootPage in LogOut action
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popToRoot();
      // Handles possible error
    }).catch(err => {
      console.error("An errror occurred at logout's AuthProvider method");
      console.error(err);
    });
  }

  profile() {
    this.authProvider.getToken().then((token) => {
      if(token !== null) {
        this.authProvider.getUserInfo().then((user) => {
          console.info("User retrieved");
          console.log(user);
          // Redirects to user's profile page
          this.navCtrl.push(ProfilePage, {'user': user});
        })
        .catch(error => {
          console.error("Error at getUserInfo's AuthProvider method");
          console.error(error);
        })
      }
      else {
        // Calls AUX function to handle redirect
        this.loginRedirect();
      }
    })
  }

  // Sets LoginPage as RootPage and displays a message (Session expired). Finally, redirects to LoginPage
  private loginRedirect() {
    this.authProvider.displayToast();
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

  deleteToken() {
    this.authProvider.delete();
  }

  indexPage() {
    this.authProvider.getToken().then((token) => {
      if(token !== null) {
        this.prodsProvider.productsIndex().then(data => {
          console.info("Categories retrieved:");
          console.log(data);
          // Redirects to X page

        })
        .catch(err => {
          console.error("Error at productsIndex ProdsProvider's method");
          console.error(err);
        });
      }
      else {
        // Calls AUX function to handle redirect
        this.loginRedirect();
      }
    })
    .catch(err => {
      console.error(err);
    })
  }

  private goReferences() {
    this.authProvider.getToken().then(token => {
      if(token !== null) {
        console.log("Browsing to ReferencePage");
        this.navCtrl.push(ReferencesPage, {}, this.authProvider.transitionOpts);
      }
      else {
        this.loginRedirect();
      }
    })
    .catch(err => {
      console.error(err);
      this.authProvider.displayToast(err);
    })
  }

  private goCategories() {
    this.authProvider.getToken().then(token => {
      if(token !== null) {
        console.log("Browsing to CategoriesPage");
        this.navCtrl.push(CategoriesPage, {}, this.authProvider.transitionOpts);
      }
      else {
        this.loginRedirect();
      }
    })
    .catch(err => {
      console.error(err);
      this.authProvider.displayToast(err);
    })
  }

  // Open the specified URL received as param
  private goURL(url:string) {
    // If plaftorm is native (cordova), uses SafariViewController
    if(this.platform.is('cordova')) {
      // Check if safariViewController is available
      this.safariCtrl.isAvailable()
        .then((available: boolean) => {
          // If it does =>
          if (available) {
            // Configures and opens brownser's tab
            this.safariCtrl.show({
              url: url,
              hidden: false,
              animated: false,
              transition: 'curl',
              enterReaderModeIfAvailable: true,
              tintColor: '#ff0000'
            })
            // Subcribes the result event
            .subscribe((result: any) => {
                console.info("URL opened with SafariViewController");
                console.info(result);
                if(result.event === 'opened') console.log('Opened');
                else if(result.event === 'loaded') console.log('Loaded');
                else if(result.event === 'closed') console.log('Closed');
              },
              // Handles the error
              (error: any) => {
                console.error(error);
                this.authProvider.displayToast("An error ocurred opening brownser's tab");
              }
            );
          // IF no SafariViewController is available =>
          } else {
            // use fallback browser, example InAppBrowser
            this.inAppBrowser.create(url, "_blank");
            console.info("URL opened with InAppBrowser");
          }
        }
      );
    }
    // If platform is no native =>
    else {
      window.open('https://www.pcbox.com/');
      console.info("URL opened with windows browser");
    }
  }

}
