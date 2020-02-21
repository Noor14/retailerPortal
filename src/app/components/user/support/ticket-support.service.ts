import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class TicketSupportService {

  constructor(private _http: HttpClient) { }

  getCalls(resourceName, rightId) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'dataType': 'json',
        'authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('userIdentity')).access_token,
        'rightid': rightId
      })
    };
    return new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${resourceName}`;
      this._http.get(apiURL, httpOptions)
        .toPromise()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })

    });
  }
  postCalls(recourseName, obj, rightId) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'dataType': 'json',
        'authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('userIdentity')).access_token,
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

}
