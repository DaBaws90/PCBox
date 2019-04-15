import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from 'ionic-angular';
import { templateJitUrl } from '@angular/compiler';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {
  
  header = new HttpHeaders({ "Content-Type": "application/json", "Accept": "application/json" });

  baseUrl:string = "https://localhost/public/api/auth";

  token:any;

  constructor(public http: HttpClient, private storage: Storage, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    console.log('Hello AuthenticationProvider Provider');
    
  }

  login(data:any) {
    return new Promise((resolve, reject) => {
      // Añadir headers Bearer token en peticiones
      this.http.post(this.baseUrl + "", JSON.stringify(data))
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }
  
  register(data:any) {
    return new Promise((resolve, reject) => {
      // data.password_confirmation = "LEL";
      // Send a HTTP Request to the specified URL
      this.http.post(this.baseUrl + "/register", JSON.stringify(data), { headers: this.header})
        // Subscribes the response to manage it accordingly
        .subscribe(response => {
          // Do something on success
          resolve(response);
        }, error => {
          // Calls the AUX function to properly handle the error response and set the return value into a local var to display a message
          let temp = this.errorHandler(error);
          // Shows a message with user friendly info about the error
          let toast = this.toastCtrl.create({
            message: temp,
            duration: 5000,
            position: 'bottom'
          });
          toast.present();
          // Resolve/returns JSON response from API Controller
          resolve(error);

          if(error.status === 401){
            resolve("401 LUL");
          }
          else {
            resolve(error);
          }
        });
    });
  }

  // AUX function to display a popup (alert) containing error details
  private showAlert(text:string) {
    let alert = this.alertCtrl.create({
      title: "Whoops!",
      subTitle: text,
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            // Do something on dismiss
            console.log('Agree clicked');
          }
        }
      ],
    });
    alert.present();
  }
  
  getUsers() {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/users").subscribe(result => {
        resolve(result);
      }, error => {
        console.log(error);
      });
    });
  }

  // AUX function to handle the local storage save proccess
  private saveOnStorage(token:any) {
    // Waits until storage is ready, then =>
    this.storage.ready()
      .then(() => {
        // Saves the token
        this.storage.set('token', token.accessToken)
      })
      .catch(error => {
        // Handles the error
        console.log(error);
      });
  }

  // AUX function to handle error based on response type
  private errorHandler(error: HttpErrorResponse) {
    // Creates an empty string var
    let temp = "";

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
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    return temp;
  }

}
