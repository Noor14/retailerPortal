import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userIdentity: any;
  constructor(private _http: HttpClient) {
   }
  login(userCredentials: any) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/Token`;
      this._http.post(apiURL, userCredentials)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    });
    return promise;
  }
  
  logoutUser() {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/users/logout`;
      this._http.delete(apiURL)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    })
    return promise;
  }

  postCalls(UserData, recourseName, rightId?) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${recourseName}`;
      this._http.post(apiURL, UserData)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    });
    return promise;
  }

  tokenValidate(accesstoken) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/users/ValidateToken`;
      this._http.post(apiURL, accesstoken)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    });
    return promise;
  }
 

}
