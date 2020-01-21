import { Injectable } from '@angular/core';
import { baseApi } from '../../../constant/baseurl';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }
  login() {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/Token`;
      this._http.post(apiURL, {})
        .toPromise()
        .then(
          succ => { // Success
          // succ.json().results;
          resolve();
          },
          err => { // Error
          reject(err);
          }
        );
    });
    return promise;
  }
  }
