import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationProvider } from '../authentication/authentication';
// import { resolveDefinition } from '@angular/core/src/view/util';

/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductsProvider {

  baseUrl = "https://localhost/public/api/products";

  // Generates a proper header
  header = new HttpHeaders({
    "Content-Type": "application/json", 
    "Accept": "application/json", 
    'Authorization': 'Bearer ' + this.authProvider.token['access_token']
  });

  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    console.log('Hello ProductsProvider Provider');
  }

  productsIndex() {
    // Returns a promise to sync the app's flow
    return new Promise((resolve, reject) => {
      // Send HTTP Request to the specified URL
      this.http.get(this.baseUrl, { headers: this.header })
        // Subscribes and resolves the response on success
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          // Handles the error and displays an info message to user
          let tmp = this.authProvider.errorHandler(error);
          this.authProvider.displayToast(tmp);
          reject(error);
      });
    })
  }

  referencesSearch(data:any) {
    // Returns a promise to sync the app's flow
    return new Promise((resolve, reject) => {
      // Send HTTP Request to the specified URL
      this.http.post(this.baseUrl + '/refSearch', JSON.stringify(data), { headers: this.header })
        .subscribe(response => {
          resolve(response);
        }, error => {
          // Handles the error and displays an info message to user
          let tmp = this.authProvider.errorHandler(error);
          this.authProvider.displayToast(tmp);
          reject(error);
      });
    });
  }
}
