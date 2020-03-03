import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private _http: HttpClient) { }

  makePayment(obj, rightId, resourceName) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${resourceName}`;
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
  getVoucher(id){
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/prepaidrequests/printRecipt/${id}`;
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
  getDistributorsList(){
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/prepaidrequests/GetByRetailerCode`;
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
}
