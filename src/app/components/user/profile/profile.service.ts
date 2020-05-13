import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private _http: HttpClient) { }

  getById(fetchingId, rightId, resourceName) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${resourceName}/${fetchingId}`;
      this._http.get(apiURL)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    })
    return promise;
  }

  postCalls(obj, rightId, resourceName) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${resourceName}`;
      this._http.post(apiURL, obj)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    })
    return promise;
  }
}
