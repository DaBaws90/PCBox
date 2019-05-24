import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationProvider } from '../authentication/authentication';
import { Events } from 'ionic-angular';

declare var require:Function;
const localForage:LocalForage = require('localforage');

/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductsProvider {

  baseUrl = "https://localhost/public/api/products";
  // baseUrl = "https://192.168.2.6/public/api/products";
  header:any;

  constructor(public http: HttpClient, public eventListener: Events) {
    console.log('Hello ProductsProvider Provider');
    localForage.config({
      name: 'MyApp'
    });

    this.eventListener.subscribe('tokenValueSet', token => {
      console.info("Event triggered");
      // Generates a proper header
      this.header = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json", 
        'Authorization': 'Bearer ' + token['access_token']
      });
      console.info(token)
    })
    
    // setInterval(() => {
    //   console.log("Testing")
    // }, 1000);

    // if(this.checkStorage()) {
    //   this.getStorageItem();
    // }
    // else {
    //   console.info("storage has no property")
    //   setInterval(() => {

    //   })
    // }
  }

  private checkStorage() {
    return localForage.hasOwnProperty('token');
  }

  private getStorageItem() {
    localForage.getItem('token').then(token => {
      // Generates a proper header
      this.header = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json", 
        'Authorization': 'Bearer ' + token['access_token']
      });
    })
  }

  productsIndex(token:any) {
    // Returns a promise to sync the app's flow
    return new Promise((resolve, reject) => {
      this.header = new HttpHeaders({ 
        "Content-Type": "application/json", 
        "Accept": "application/json", 
        'Authorization': 'Bearer ' + token['access_token'],
      });
      // Send HTTP Request to the specified URL
      this.http.get(this.baseUrl, { headers: this.header })
        // Subscribes and resolves the response on success
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          // Handles the error and displays an info message to user
          // let tmp = this.authProvider.errorHandler(error);
          // this.authProvider.displayToast(tmp);
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
          // let tmp = this.authProvider.errorHandler(error);
          // this.authProvider.displayToast(tmp);
          reject(error);
      });
    });
  }

  categoriesSearch(data:any) {
    // Returns a promise to sync the app's flow
    return new Promise((resolve, reject) => {
      // Send HTTP Request to the specified URL
      this.http.post(this.baseUrl + '/catSearch', JSON.stringify(data), { headers: this.header })
        .subscribe(response => {
          resolve(response);
        }, error => {
          // Handles the error and displays an info message to user
          // let tmp = this.authProvider.errorHandler(error);
          // this.authProvider.displayToast(tmp);
          reject(error);
      });
    });
  }
}
