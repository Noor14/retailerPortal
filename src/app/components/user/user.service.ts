import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  logoutUser() {
    let obj={
      "Content-Type": 'application/json; charset=utf-8',
      "dataType": 'json',
      "authorization": 'Bearer ' + JSON.parse(localStorage.getItem('userIdentity')).access_token
  
    };
    let httphead = {
      headers: new HttpHeaders(obj)
    }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/users/logout`;
      this._http.post(apiURL,{}, httphead)
        .toPromise()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
    return promise;
  }
}
