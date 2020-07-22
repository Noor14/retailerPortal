import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class PaymentViewService {

  constructor(private _http: HttpClient) { }

  getDetail(resourceName, requestId) {
    const promise = new Promise((resolve, reject) => {
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

  postCall(obj, resourceName) {
    const promise = new Promise((resolve, reject) => {
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
    const promise = new Promise((resolve, reject) => {
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
    const promise = new Promise((resolve, reject) => {
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



  getJazzPaymentData(resourceName,selectedItem)
  {
    const promise = new Promise((resolve, reject) => {
     const apiURL = `${baseApi}/api/${resourceName}/${selectedItem}`;
      //const apiURL = `${baseApi}/api/payaxis/PrePaidPay`;
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

