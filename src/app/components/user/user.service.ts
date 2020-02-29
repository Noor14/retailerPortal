import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  logoutUser() {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/users/logout`;
      this._http.delete(apiURL)
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
