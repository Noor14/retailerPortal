import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  head: any = {
    "Content-Type": 'application/json; charset=utf-8',
    "dataType": 'json',
    "authorization": 'Bearer ' + JSON.parse(sessionStorage.getItem('userIdentity')).access_token

  };
  constructor(private _http: HttpClient) { }

  makePayment(obj, rightId, resourceName) {
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

  getDistributorsList(){
    let httphead = {
      headers: new HttpHeaders(this.head)
    }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/prepaidrequests/GetByRetailerCode`;
      this._http.get(apiURL, httphead)
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
