import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { meezanbaseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _http: HttpClient) { }

  getById(fetchingId, rightId, resourceName) {
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${meezanbaseApi}/api/${resourceName}/${fetchingId}`;
      this._http.get(apiURL)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        );
    });
    return promise;
  }
  getCall(resourceName) {
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${meezanbaseApi}/api/${resourceName}`;
      this._http.get(apiURL)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        );
    });
    return promise;
  }
  postCall(obj, resourceName) {
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${meezanbaseApi}/api/${resourceName}`;
      this._http.post(apiURL, obj)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        );
    });
    return promise;
  }
}
