import { Injectable } from '@angular/core';
import { baseApi } from '../../../constant/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }
  login(userCredentials :any) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'dataType': 'json' })

  }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/Token`;
      this._http.post(apiURL, userCredentials,httpOptions)
        .toPromise()
        .then(
          res => { // Success
            
            resolve(res);
          },
          err => { // Error
          reject(err);
          }
        );
    });
    return promise;
  }

  registerUser(UserData){
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'dataType': 'json' })

  }
  
  let promise = new Promise((resolve,reject) =>{
    const apiURL = `${baseApi}api/retailer/Register`;
  this._http.post(apiURL,UserData,httpOptions)
  .toPromise()
  .then(
    res =>{
      resolve(res);
    },
    err =>{
      reject(err);
    }
  )
  });
  return promise;
  }
  }
