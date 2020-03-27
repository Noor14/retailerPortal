import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {

  constructor(private _http: HttpClient) { }

  getDetail(requestId) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/Orders/${requestId}`;
      this._http.get(apiURL)
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
  getKYCListDetail(apiEndPath,requestId){
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${apiEndPath}/${requestId}`;
      this._http.get(apiURL)
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
  orderSave(obj){
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/Orders/saveOrder`;
      this._http.post(apiURL, obj)
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


