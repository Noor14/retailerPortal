import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class PaymentViewService {

  constructor(private _http: HttpClient) { }

  getDetail(resourceName, requestId) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${resourceName}/${requestId}`;
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

  makePayment(obj, rightId, resourceName) {
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
  getVoucher(endPoint, id){
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${endPoint}/${id}`;
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
  getDistributorsList(){
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/prepaidrequests/GetByRetailerCode`;
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
}

