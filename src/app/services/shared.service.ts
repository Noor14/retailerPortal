import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public dropDownValues= new BehaviorSubject<any>(undefined);
  public btnToggling = new BehaviorSubject<any>(undefined);
  public loadingLogOut = new BehaviorSubject<any>(undefined);
  
  private renderComponentInfo = new BehaviorSubject<any>(null);
  public renderComponent = this.renderComponentInfo.asObservable();

  private userInfo = new BehaviorSubject<any>(undefined);
  public getUserInfo = this.userInfo.asObservable();
  
  private userRoles: any = new BehaviorSubject<any>(null);

  public callLogout:boolean = false;
  public validateTokenCall:boolean = false;
  constructor(public _jwtHelper: JwtHelperService) { }

  public setRenderComponent(data){
    this.renderComponentInfo.next(data);
  }
  public setUser(data) {
    this.userInfo.next(data);
  }
  public getUser() {
    return this.userInfo.getValue();
  }

  public setUserRole(data) {
    this.userRoles.next(data);
  }
  public getUserRole() {
    return this.userRoles.getValue();
  }



  public isAuthenticated(): boolean {
    const obj = JSON.parse(localStorage.getItem('userIdentity'));
      if(obj && obj.access_token && obj.UserAccount && obj.UserAccount.IsTermAndConditionAccepted && obj.UserAccount.UpdatePassword){
        // Check whether the token is expired and return
        // true or false
        return !this._jwtHelper.isTokenExpired(obj.access_token);
      }
    else{
        return false;
      }
  }
}
