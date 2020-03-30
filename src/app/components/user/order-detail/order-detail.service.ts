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
  getKYCAndTemplateListDetail(apiEndPath,requestId){
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
  getTemplateDetail(apiEndPath, requestId, dealerCode){
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${apiEndPath}/${requestId}/${dealerCode}`;
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

  save(apiEndPath, obj){
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${apiEndPath}`;
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


