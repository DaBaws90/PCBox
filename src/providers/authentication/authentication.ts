import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController, NavController, LoadingController } from 'ionic-angular';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/map';

declare var require:Function;
const localForage:LocalForage = require('localforage');

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {
  
  header = new HttpHeaders({ "Content-Type": "application/json", "Accept": "application/json" });

  baseUrl:string = "https://localhost/public/api/auth";
  // baseUrl:string = "https://192.168.2.6/public/api/auth";
  // baseUrl:string = "https://10.10.1.106/public/api/auth";

  token:any;

  transitionOpts = {
    animation: 'md-transition',
    duration: 1000,
  };

  loadingOpts = {
    content: 'Loading. Please, wait.',
    spinner: 'crescent',
    dismissOnPageChange: true,
  };

  constructor(public http: HttpClient, private storage: Storage, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    console.log('Hello AuthenticationProvider Provider');
    localForage.config({
      name: 'MyApp'
    });
  }

  // Handles the login user's HTTP request
  login(data:any) {
    return new Promise((resolve, reject) => {
      // Send a HTTP Request to the specified URL
      this.http.post(this.baseUrl + "/login", JSON.stringify(data), { headers : this.header })
        // Subscribes the response to manage it accordingly
        .subscribe(response => {
          // Stores the token received on response
          this.saveOnStorage(response).then(() => {
            this.displayToast("Successfully logged in");
            resolve(response);
          })
          // Handles errors from token saving function
          .catch(err => {
            console.info("Error saving token in storage");
            console.error(err);
          });
        }, error => {
          // Handles the error response from HTTP request
          let temp = this.errorHandler(error);
          this.displayToast(temp);
          reject(error);
        });
    });
  }
  
  // Handles the register user's HTTP request
  register(data:any) {
    return new Promise((resolve, reject) => {
      // Send a HTTP Request to the specified URL
      this.http.post(this.baseUrl + "/register", JSON.stringify(data), { headers: this.header})
        // Subscribes the response to manage it accordingly
        .subscribe(response => {
          // Do something on success
          this.displayToast("User " + response['success']['user']['email'] + " was succesfully registered");
          resolve(response);
        }, error => {
          // Calls the AUX function to properly handle the error response and set the return value into a local var to display a message
          let temp = this.errorHandler(error);
          // Shows a message with user friendly info about the error
          this.displayToast(temp);
          // Rejects JSON error response from API Controller
          reject(error);
        });
    });
  }

  // Handles the logout HTTP Request
  logout() {
    return new Promise((resolve, reject) => {
      this.getToken().then((data) => {
        // Appends the auth token in the headers
        let headerTmp = new HttpHeaders({'Authorization': 'Bearer ' + data['access_token']})
        // Send a HTTP Request to the specified URL with headers properly set
        this.http.get(this.baseUrl + '/logout', { headers: headerTmp })
          // Subscribes to HTTP response
          .subscribe(response => {
            // Removes token from local storage
            localForage.removeItem('token').then(() => {
              console.info("Token cleared!");
              // Displays logged out success response
              this.displayToast(response['success']);
              resolve(response);
            }).catch(err => {
              console.error("Unable to remove token");
              console.error(err);
              resolve(err);
            });
        // Handles the error in HTTP request and displays an info message to user
        }, error => {
            console.error("An eror ocurred: ");
            console.log(error);
            let tmp = this.errorHandler(error);
            this.displayToast(tmp);
            reject(error);
        })
      })      
    })
  }

  // Retrieves the current authenticated user's info (ProfilePage method)
  getUserInfo() {
    return new Promise((resolve, reject) => {
      // Sets the headers properly
      let header = new HttpHeaders({ 
        "Content-Type": "application/json", 
        "Accept": "application/json", 
        'Authorization': 'Bearer ' + this.token['access_token']
      });
      // Sends a HTTP request to the specified URL
      this.http.get(this.baseUrl + '/user', { headers: header})
        // Subscribs and resolves the response on success
        .subscribe((response) => {
          resolve(response);
        }, error => {
          // Handles the error and displays a message to user. Then, rejects the error
          console.error("Error at getUserInfo method");
          let tmp = this.errorHandler(error);
          this.displayToast(tmp);
          reject(error);
        });
    });
  }

  // AUX function to handle the local storage save proccess
  private saveOnStorage(token:any) {
    return new Promise((resolve, reject) => {
      // Waits until storage is ready, then =>
      localForage.ready().then(() => {
        // Saves the token
        localForage.setItem('token', token).then(() => {
          // Retrieves the token value and saves it into a var
          this.getToken().then(() => {
            console.info("TOKEN HAS BEEN SET");
            resolve(true);
          });
        })
        // Handles errors in token saving process
        .catch(err => {
          console.error("TOKEN CANNOT BE SET")
          reject(err);
        });
      });
    });
  }

  // Gets the token value and stores it into a var
  getToken() {
    return new Promise((resolve, reject) => {
      // Retrieves the token value from storage
      localForage.getItem('token')
        .then( data => {
          // Check if token has expired
          if(!this.checkExpiredToken(data)) {
            // Save the value into a var if token still "alive"
            this.token = data;
            console.info("Token didn't expire yet");
            resolve(data);
          }
          else {
            localForage.removeItem('token').then(() => {
              // If token has expired, removes it and unsets the var
              this.token = null;
              console.info("Token expired");
              resolve(null);
            })
            // Reject the error in case the token was not able to be deleted
            .catch(err => {
              reject(err);
            })
          }
        })
        // Handles the error retrieving token's value
        .catch(err => {
          // console.error("An error has ocurred while retrieving the token");
          reject(err);
        });
      })
  }

  // Check if token is already expired
  private checkExpiredToken(token:any) {
    // Returns true if token has already expired, false if it didn't
    return Date.parse(token['expires_at']) < Date.parse(new Date().toISOString());
  }

  // AUX function to display a popup (alert) containing error details
  showAlert(text:string) {
    let alert = this.alertCtrl.create({
      title: "Something went wrong!",
      subTitle: text,
      buttons: [{
        text: 'Accept',
        handler: () => {
          // Do something on dismiss
          console.log('Agree clicked');
        }
      }],
    });
    alert.present();
  }

  // AUX (public) function to display a message (toast) on success *OVERLOAD + 1*
  displayToast(text:string  = "Session expired. Please, log in again") {
    this.toastCtrl.create({
      message: text,
      duration: 5000,
      position: 'bottom',
    }).present();
  }

  spinner() {
    return this.loadingCtrl.create( this.loadingOpts );
  }

  // AUX (public) function to handle error based on response type
  errorHandler(error: HttpErrorResponse) {
    // Creates an empty string var
    let temp = "";

    if(error.error.error) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
        // Fills the empty tring with a message
        temp = 'An error occurred:', error.error.message;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong
        
        // Gets every key for very single errors array elements
        let keys = Object.keys(error.error.error);
          // Generates a string to show it up in an alert modal
          temp = `Error code ${error.status} (${error.statusText}), error(s) details are: `
          // Iterates over the errors array and concats every error into the string
          for(var i = 0; i < keys.length; i++) {
            temp += error.error.error[keys[i]][0];
          }
        console.error(`Backend returned code ${error.status}, message was: ${temp}`);
      }
    }
    else {
      temp = `Error code ${error.status} (${error.statusText}), error(s) details are: ` + error.error.message;
    }
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    return temp;
  }

}
