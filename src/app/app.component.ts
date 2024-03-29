import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { trigger, state, style, animate, transition, sequence } from '@angular/animations';

import { AuthenticationProvider } from '../providers/authentication/authentication';
import { ProfilePage } from '../pages/profile/profile';
import { ReferencesPage } from '../pages/references/references';
import { CategoriesPage } from '../pages/categories/categories';
import { ProductsProvider } from '../providers/products/products';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  pages:any;
  user:any;
  categories:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private authProv: AuthenticationProvider,
    private prodsProvider: ProductsProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Check if there is a token currently stored in order to set the RootPage dynamically
      this.authProv.getToken().then((token) => {
        if(token) {
          console.log("Token loaded at startup");
          // console.log(token);
          this.user = token['user'];
          this.rootPage = HomePage;
        }
        else {
          console.log("Token expired");
          this.rootPage = LoginPage;
        }
      })
      .catch(err => {
        console.info("An error has occurred retrieving the token");
        console.error(err);
      });

      this.pages = [
        { name: 'Inicio', page: HomePage },
        { name: 'Perfil', page: ProfilePage },
        { name: 'Buscador referencias', page: ReferencesPage },
        { name: 'Buscador categorías', page: CategoriesPage }
      ]
    });
  }

  goToPage(page: any) {
    // Present a spinner on method's call
    const spinner = this.authProv.spinner();
    spinner.present();
    // Check if token is still valid
    this.authProv.getToken().then(token => {
      if(token) {
        console.log("Brownsing to " + page.name);

        switch (page.page) {
          case ProfilePage:
            this.authProv.getUserInfo().then(user => {
              this.nav.push(page.page, {'user': user }, this.authProv.transitionOpts )
            })
            .catch(err => {
              spinner.dismiss();
              // Send error response to ErrorHandler method and returns a formatted string. Then, displays the string with a toast
              // console.error(err);
              // Error message is already displayed in a toast
              // let tmp = this.authProv.errorHandler(err);
              // this.authProv.displayToast(tmp);
            })
            break;

          case CategoriesPage:
            this.prodsProvider.productsIndex(token).then(response => {
              this.nav.push(page.page, {'categories': response['categories']}, this.authProv.transitionOpts )
            })
            .catch(err => {
              spinner.dismiss()
              this.authProv.displayToast(this.authProv.errorHandler(err))
              console.log("Error at app.component's productsIndex: " + JSON.stringify(err.error.message))
            })
            break;

          case ReferencesPage:
            this.nav.push(ReferencesPage, {}, this.authProv.transitionOpts)
            break;
        
          default:
            console.log("Default case")
            this.nav.popToRoot().then(() => {
              spinner.dismiss();
            });
            break;
        }

      }
      else {
        // Token's value is null, so session has already expired => Redirects to LoginPage
        this.loginRedirect();
      }
    })
    .catch(err => {
      spinner.dismiss();
      // Send error response to ErrorHandler method and returns a formatted string. Then, displays the string with a toast
      console.error(err);
      let tmp = this.authProv.errorHandler(err);
      this.authProv.displayToast(tmp);
    })
  }

  // Handles logout HTTP request
  logout() {
    // Present a spinner on method's call
    const spinner = this.authProv.spinner();
    spinner.present();
    // Handles logout HTTP request
    this.authProv.logout().then(response => {
      // We don't call the loginRedirect function because it displays the session expired mssg on call, and we don't need it at this moment
      this.nav.setRoot(LoginPage).then(() => {
        this.nav.popToRoot();
      })
    })
    // Handles errors on HTTP request
    .catch(err => {
      spinner.dismiss();
      console.error("An errror occurred at logout's AuthProvider method");
      console.error(err);
    });
  }

  // Sets LoginPage as RootPage and displays a message (Session expired). Finally, redirects to LoginPage
  private loginRedirect() {
    this.authProv.displayToast();
    this.nav.setRoot(LoginPage).then(() => {
      this.nav.popToRoot();
    });
  }

}

