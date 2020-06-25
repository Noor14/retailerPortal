import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from '../../../constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http: HttpClient) { }
  
  postCalls(recourseName, obj) {
    let promise = new Promise((resolve, reject) => {
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
  deletePayment(id) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/prepaidrequests/Delete/${id}`;
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
  deleteOrder(id) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/orders/deletedraft/${id}`;
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
  cancelOrder(obj) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/orders/cancelorder`;
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
  getJazzPaymentData(resourceName,selectedItem)
{
  let promise = new Promise((resolve, reject) => {
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
