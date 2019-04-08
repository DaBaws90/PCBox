import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {
  header = new HttpHeaders({ "Content-Type": "application/json", "Accept": "application/json" });
  baseUrl:string = "https://localhost/public/api/auth";
  // baseUrl:string = "https://jsonplaceholder.typicode.com";

  constructor(public http: HttpClient) {
    console.log('Hello AuthenticationProvider Provider');
  }

  login(data:any) {
    // Metodos podrían retornar el resultado del http.request en lugar de la promesa(TAL COMO ESTÁ, FUNCIONA, AL MENOS EL REGISTER)
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "", JSON.stringify(data))
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }
  
  register(data:any) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/register", JSON.stringify(data), { headers: this.header})
        .subscribe(result => {
          resolve(result);
        }, error => {
          console.log(error);
          reject(error);
        });
    });
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

}
