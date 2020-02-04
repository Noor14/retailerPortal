import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userIdentity: any;
  constructor(private _http: HttpClient) {
   }
  login(userCredentials: any) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'dataType': 'json' })

    }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/Token`;
      this._http.post(apiURL, userCredentials, httpOptions)
        .toPromise()
        .then(
          (res: any[]) => { // Success
            resolve(res);
          },
          err => { // Error
            reject(err);
          }
        );
    });
    return promise;
  }

  PostCalls(UserData, recourseName, rightId) {
    let httpOptions :any;
    let obj:any = { 
      "Content-Type": 'application/json; charset=utf-8', 
      "dataType": 'json', 
    };
    if (sessionStorage.getItem('userIdentity') !=null) {
      obj["authorization"] = 'Bearer ' + JSON.parse(sessionStorage.getItem('userIdentity')).access_token;
      obj["rightid"] = rightId;
       httpOptions = {
        headers: new HttpHeaders(obj)
      }
    }
    else {
      httpOptions = {
        headers: new HttpHeaders(obj)

      }
    }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${recourseName}`;
      this._http.post(apiURL, UserData, httpOptions)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        )
    });
    return promise;
  }
 

}
