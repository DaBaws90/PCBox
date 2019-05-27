import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';
import { Page } from 'ionic-angular/umd/navigation/nav-util';
import { ReferencesPage } from '../references/references';
import { CategoriesPage } from '../categories/categories';
import { ProductsProvider } from '../../providers/products/products';

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
  zone: NgZone;
  user:any;
  page:Page;
  categories:any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthenticationProvider, 
    private prodsProvider: ProductsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillLoad() {
    let temp = this.navParams.get('user');
    this.user = temp['user'];
  }

  private editProfile() {
    // Present a spinner on method's call
    const spinner = this.authProvider.spinner();
    spinner.present();
    // Check if token is still valid
    this.authProvider.getToken().then(token => {
      if(token !== null) {
        this.authProvider.editUserInfo(this.user).then(response => {
          spinner.dismiss();
          console.info(response);
        });
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
      let mssg = this.authProvider.errorHandler(err);
      this.authProvider.displayToast(mssg);
    })
  }

  private goTo(option:string) {
    // Present a spinner on method's call
    const spinner = this.authProvider.spinner();
    spinner.present();
    // Check if token is still valid
    this.authProvider.getToken().then(token => {
      if(token) {

        switch (option) {
          case 'HomePage':
            this.page = null;
            this.navCtrl.popToRoot();
            break;

          case 'ReferencesPage':
            this.page = ReferencesPage;
            break;

          case 'CategoriesPage':
            this.page = CategoriesPage;
            this.prodsProvider.productsIndex(token).then(response => {
              this.navCtrl.push(this.page, {'categories': response['categories']}, this.authProvider.transitionOpts );
            })
            .catch(err => {
              spinner.dismiss()
              this.authProvider.displayToast(this.authProvider.errorHandler(err))
              console.error("Error at profile's switch (Categories case): " + JSON.stringify(err.error.message));
            });
            break;
        
          default:
            this.authProvider.logout().then(() => {
              // We don't call the loginRedirect function because it displays the session expired mssg on call, and we don't need it at this moment
              this.navCtrl.setRoot(LoginPage).then(() => {
                console.log("Browsing to RootPage (LoginPage)")
                this.page = null;
                this.navCtrl.popToRoot();
              })
            })
            .catch(err => {
              spinner.dismiss()
              this.authProvider.displayToast(this.authProvider.errorHandler(err))
              console.error("Error at profile's logout: " + JSON.stringify(err.error.message));
            });
            break;
        } // Switch ending

        if (this.page && this.page != CategoriesPage) {
            this.navCtrl.push(this.page, {}, this.authProvider.transitionOpts );
        }
        
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
      let mssg = this.authProvider.errorHandler(err);
      this.authProvider.displayToast(mssg);
    })
  
  }

  // Sets LoginPage as RootPage and displays a message (Session expired). Finally, redirects to LoginPage
  private loginRedirect() {
    this.authProvider.displayToast();
    this.navCtrl.setRoot(LoginPage).then(() => {
      this.navCtrl.popToRoot();
    });

  }

  private redirectBack() {
    this.navCtrl.pop().then(() => {
      // this.navCtrl.popToRoot();
    //   this.zone.run(() => {
    //     console.log("Page refreshed")
    //   })
    });
  }

}
