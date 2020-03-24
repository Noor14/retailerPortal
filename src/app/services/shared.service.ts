import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { baseApi } from '../constant/baseurl';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public dropDownValues= new BehaviorSubject<any>(undefined);
  public btnToggling = new BehaviorSubject<any>(undefined);
  
  private userInfo = new BehaviorSubject<any>(undefined);
  public getUserInfo = this.userInfo.asObservable();

  constructor(private _http: HttpClient) { }
  logoutUser() {
    let promise = new Promise((resolve, reject) => {
      const apiURL = `${baseApi}/api/users/logout`;
      this._http.delete(apiURL)
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
  setUser(data) {
    this.userInfo.next(data);
  }
  getUser() {
    return this.userInfo.getValue();
  }
}
