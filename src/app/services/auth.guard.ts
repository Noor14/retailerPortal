import { LoginService } from './../components/authentication/login/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './../components/user/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { SharedService } from './shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    protected _sharedService: SharedService,
    protected _route: Router,
    private _userService: UserService,
    private _loginService: LoginService,
    private _jwtHelper: JwtHelperService,
    private _toast: ToastrService

    ){
  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree>  {
      if (!this._sharedService.isAuthenticated() || 'true' === next.queryParamMap.get('logout')) {
        if('true' === next.queryParamMap.get('logout') && this._sharedService.isAuthenticated() && !this._sharedService.callLogout){
          return this.logout().then(val=> val);
        }
        else{
         let userIdentity = (localStorage.getItem('userIdentity'))? JSON.parse(localStorage.getItem('userIdentity')) : undefined;
            if(state.url == '/eula'){
              if(userIdentity 
                && userIdentity.UserAccount 
                && !userIdentity.UserAccount.IsTermAndConditionAccepted
                ){
                  return true;
                }else{
                  return false;
                }
            }
            else if(state.url.indexOf('/updatePassword')>=0){
              if(userIdentity 
                && userIdentity.UserAccount 
                && userIdentity.UserAccount.IsTermAndConditionAccepted 
                && userIdentity.UserAccount.Username
                && !userIdentity.UserAccount.UpdatePassword){
                  return true;
                }
                else if(!userIdentity && state.url.split('/updatePassword?').pop().length){
                  let accessToken = state.url.split('/updatePassword?').pop();
                  if(this._jwtHelper.isTokenExpired(accessToken)){
                  this._toast.error("Link has been expired");
                  return false;
                  }else{
                    if(this.validateToken(accessToken).then(val=> val)){
                      let obj =  this._jwtHelper.decodeToken(accessToken);
                      let object = {
                        access_token: accessToken,
                        UserAccount: obj.user
                      }
                        localStorage.setItem('userIdentity', JSON.stringify(object));
                    return true;
                    }else{
                     this._toast.error("Link has been expired");
                     return false;
                    }
                    
                  }
                }
                else{
                  return false;
                }
            }
            else{
              return true;
            }
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
  validateToken(accessToken){
      return this._loginService.tokenValidate(accessToken).then((res:boolean)=>{
        if(res){
          return Promise.resolve(res);
        }else{
          return Promise.resolve(false);
        }   
      })
      .catch((err:HttpErrorResponse)=>{
        return Promise.resolve(false);
        })
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
    _route: Router,  
    _userService: UserService,
    _loginService: LoginService,
    _jwtHelper: JwtHelperService,
    _toast: ToastrService){
    super(_sharedService, _route, _userService, _loginService, _jwtHelper, _toast)
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