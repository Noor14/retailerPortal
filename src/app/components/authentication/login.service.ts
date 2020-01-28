import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseApi } from 'src/app/constant/baseurl';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userIdentity: any;
  constructor(private _http: HttpClient) {
    if(sessionStorage.getItem('UserIdentity') !=null){
      this.userIdentity = JSON.parse(sessionStorage.getItem('UserIdentity') );
    }
   }
  login(userCredentials: any) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'dataType': 'json' })

    }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/Token`;
      this._http.post(apiURL, userCredentials, httpOptions)
        .toPromise()
        .then(
          (res: any[]) => { // Success
            // if (res.UserAccount) {
              this.userIdentity = res;
            // }
            resolve(res);
          },
          err => { // Error
            reject(err);
          }
        );
    });
    return promise;
  }

  PostCalls(UserData, recourseName,rightId) {
    let httpOptions :any;
    if (sessionStorage.getItem('UserIdentity') !=null ) {
       httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'dataType': 'json', 'Authorization': 'Bearer ' + this.userIdentity.access_token, 'rightid': rightId })

      }
    }
    else {
      httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'dataType': 'json' })

      }
    }
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/` + recourseName;
      this._http.post(apiURL, UserData, httpOptions)
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
