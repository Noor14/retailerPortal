import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private _http : HttpClient) { }


  postCalls(recourseName, obj, rightId) {
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

}
