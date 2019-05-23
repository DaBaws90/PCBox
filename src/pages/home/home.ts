import { Component } from '@angular/core';
import { NavController, Platform, Spinner } from 'ionic-angular';
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

  // Sets LoginPage as RootPage and displays a message (Session expired). Finally, redirects to LoginPage
  private loginRedirect() {
    this.authProvider.displayToast();
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

  // Navigates to ReferencesPage
  private goReferences() {
    // Present a spinner on method's call
    const spinner = this.authProvider.spinner();
    spinner.present();
    // Check if token is still valid
    this.authProvider.getToken().then(token => {
      if(token !== null) {
        // Navigates to ReferencesPage
        console.log("Browsing to ReferencePage");
        this.navCtrl.push(ReferencesPage, {}, this.authProvider.transitionOpts);
      }
      else {
        // Token's value is null, so session has already expired => Redirects to LoginPage
        this.loginRedirect();
      }
    })
    // Handles errors on token retrieving
    .catch(err => {
      spinner.dismiss();
      // Send error response to ErrorHandler method and returns a formatted string. Then, displays the string with a toast
      console.error(err);
      let temp = this.authProvider.errorHandler(err);
      this.authProvider.displayToast(temp);
    })
  }

  // Navigates to CategoriesPage
  private goCategories() {
    // Present a spinner on method's call
    const spinner = this.authProvider.spinner();
    spinner.present();
    // Check if token is still valid
    this.authProvider.getToken().then(token => {
      if(token !== null) {
        // Calls the ProductsProvider's method to manage the getCategoriesList request
        this.prodsProvider.productsIndex().then(data => {
          // Navigates to CategoriesPage
          console.log("Browsing to CategoriesPage");
          this.navCtrl.push(CategoriesPage, {'categories': data['categories'] }, this.authProvider.transitionOpts);
        })
        // Handles errors on categories list retrieving
        .catch(err => {
          spinner.dismiss();
          // Send error response to ErrorHandler method and returns a formatted string. Then, displays the string with a toast
          console.error(err);
          let temp = this.authProvider.errorHandler(err);
          this.authProvider.displayToast(temp);
        })
      }
      else {
        // Token's value is null, so session has already expired => Redirects to LoginPage
        this.loginRedirect();
      }
    })
    // Handles errors on token retrieving
    .catch(err => {
      spinner.dismiss()
      // Send error response to ErrorHandler method and returns a formatted string. Then, displays the string with a toast
      console.error(err);
      let temp = this.authProvider.errorHandler(err);
      this.authProvider.displayToast(temp);
    })
  }

  // Open the specified URL received as param
  private goURL(url:string) {
    // If plaftorm is native (cordova), uses SafariViewController
    if(this.platform.is('cordova')) {
      // Check if safariViewController is available
      this.safariCtrl.isAvailable().then((available: boolean) => {
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
                // if(result.event === 'opened') console.log('Opened');
                // else if(result.event === 'loaded') console.log('Loaded');
                // else if(result.event === 'closed') console.log('Closed');
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
