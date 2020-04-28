import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './../components/user/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    protected _sharedService: SharedService,
    protected _route: Router,
    private _userService: UserService){
  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree>  {
      if (!this._sharedService.isAuthenticated() || 'true' === next.queryParamMap.get('logout')) {
        if('true' === next.queryParamMap.get('logout') && this._sharedService.isAuthenticated() && !this._sharedService.callLogout){
          return this.logout().then(val=> val);
        }
        else{
          return true;
        }
      }
      else if(this._route && this._route.url && this._route.url != '/'){
        this._route.navigate([this._route.url]);
      }else{
        this._route.navigate(['/user/dashboard']);
      }
        this._sharedService.callLogout = false;
        return false;
  }
  canActivateChild(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree>{
   return this.canActivate(route, state);
  }
  logout(){
    this._sharedService.callLogout = true;
    this._sharedService.loadingLogOut.next(this._sharedService.callLogout);
    return this._userService.logoutUser().then((res:boolean)=>{
      this._sharedService.loadingLogOut.next(false);
      if(res){
        localStorage.clear();
        return Promise.resolve(res);
      }else{
        this._sharedService.callLogout = false;
        return Promise.resolve(this._sharedService.callLogout);
      }   
    })
    .catch((err:HttpErrorResponse)=>{
      this._sharedService.callLogout = false;
      this._sharedService.loadingLogOut.next(this._sharedService.callLogout);
      return Promise.resolve(this._sharedService.callLogout);
      })
  }
 
}
@Injectable({
  providedIn: 'root'
})
export class UserGuard extends AuthGuard {
  constructor(_sharedService: SharedService,
    _route: Router,  _userService: UserService){
    super(_sharedService, _route, _userService)
  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (this._sharedService.isAuthenticated()) {
        this._sharedService.callLogout = false;
        return true;
      }
      else if(this._route && this._route.url && this._route.url != '/'){
        this._route.navigate([this._route.url]);
      }else{
        this._route.navigate(['login']);
      }
      this._sharedService.callLogout = true;
        return false;
   
  }
 
}