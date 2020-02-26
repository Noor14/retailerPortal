import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { baseApi } from '../../../constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http: HttpClient) { }
  
  postCalls(recourseName, obj, rightId) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'dataType': 'json',
        'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userIdentity')).access_token,
        'rightid': rightId
      })
    };
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${recourseName}`;
      this._http.post(apiURL, obj, httpOptions)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        )
    });
    return promise;
  }
  deletePayment(id) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'dataType': 'json',
        'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userIdentity')).access_token,
      })
    };
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/prepaidrequests/Delete/${id}`;
      this._http.delete(apiURL, httpOptions)
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
