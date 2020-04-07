import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public dropDownValues= new BehaviorSubject<any>(undefined);
  public btnToggling = new BehaviorSubject<any>(undefined);
  
  private userInfo = new BehaviorSubject<any>(undefined);
  public getUserInfo = this.userInfo.asObservable();

  constructor(public _jwtHelper: JwtHelperService) { }

  setUser(data) {
    this.userInfo.next(data);
  }
  getUser() {
    return this.userInfo.getValue();
  }
  public isAuthenticated(): boolean {
    const obj = JSON.parse(localStorage.getItem('userIdentity'));
      if(obj && obj.access_token && obj.IsTermAndConditionAccepted){
        // Check whether the token is expired and return
        // true or false
        return !this._jwtHelper.isTokenExpired(obj.access_token);
      }
    else{
        return false;
      }
  }
}
