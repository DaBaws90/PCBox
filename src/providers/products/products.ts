import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationProvider } from '../authentication/authentication';
import { resolveDefinition } from '@angular/core/src/view/util';

/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductsProvider {

  baseUrl = "https://localhost/public/api";

  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    console.log('Hello ProductsProvider Provider');
  }

  productsIndex() {
    let header = new HttpHeaders({
      "Content-Type": "application/json", 
      "Accept": "application/json", 
      'Authorization': 'Bearer ' + this.authProvider.token['access_token']
    });

    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/products', { headers: this.authProvider.header })
        .subscribe((response) => {
          // console.log(response);
          resolve(response);
        }, (error) => {
          let tmp = this.authProvider.errorHandler(error);
          this.authProvider.displayToast(tmp);
          reject(error);
          // console.error(error);
        })
    })
  }
}
