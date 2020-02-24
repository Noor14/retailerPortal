import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private head: any = {
    "Content-Type": 'application/json; charset=utf-8',
    "dataType": 'json',
    "authorization": 'Bearer ' + JSON.parse(localStorage.getItem('userIdentity')).access_token

  };
  constructor(private _http: HttpClient) { }

  getById(obj, rightId, resourceName) {
    this.head["rightid"] = rightId;
    let httphead = {
      headers: new HttpHeaders(this.head)
    }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${resourceName}`;
      this._http.get(apiURL + obj, httphead)
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

  postCalls(obj, rightId, resourceName) {
    this.head["rightid"] = rightId;
    let httphead = {
      headers: new HttpHeaders(this.head)
    }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${resourceName}`;
      this._http.post(apiURL, obj, httphead)
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
