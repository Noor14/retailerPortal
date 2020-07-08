import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }
  postCalls(recourseName, obj) {
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${recourseName}`;
      this._http.post(apiURL, obj)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    });
    return promise;
  }
  seenNotification() {
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/useralert/MarkSeen`;
      this._http.put(apiURL, null)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    });
    return promise;
  }
  removeNotification(id) {
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/useralert/DismissAlert/${id}`;
      this._http.post(apiURL, null)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )
    });
    return promise;
  }
  getCalls(resourceName) {
    return new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${resourceName}`;
      this._http.get(apiURL)
        .toPromise()
        .then(
          res => resolve(res)
        )
        .catch(err => reject(err)
        )

    });
  }
  logoutUser() {
    const promise = new Promise((resolve, reject) => {
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

}
