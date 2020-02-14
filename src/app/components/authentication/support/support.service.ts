import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';
@Injectable({
  providedIn: 'root'
})
export class SupportService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8', 'dataType': 'json'
    })

  };
  constructor(private _http: HttpClient) {}



  getCalls(recourseName) {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/${recourseName}`;
      this._http.get(apiURL, this.httpOptions)
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
postCalls(recourseName,obj) {
  let promise = new Promise((resolve, reject) => {
    const apiURL = `${baseApi}/api/${recourseName}`;
    this._http.post(apiURL,obj, this.httpOptions)
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