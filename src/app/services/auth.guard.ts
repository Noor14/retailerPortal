import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(protected _sharedService: SharedService,
    protected _route: Router){
  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;
      if (!this._sharedService.isAuthenticated()) {
        return true;
      }
      if(this._route && this._route.url && this._route.url != '/'){
        this._route.navigate([this._route.url]);
      }else{
        this._route.navigate(['/user/dashboard']);
      }

        return false;
  }
  canActivateChild(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
   return this.canActivate(route, state);
  }
 
}
@Injectable({
  providedIn: 'root'
})
export class UserGuard extends AuthGuard {
  constructor(_sharedService: SharedService,
    _route: Router){
    super(_sharedService, _route)
  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (this._sharedService.isAuthenticated()) {
        return true;
      }
      if(this._route && this._route.url && this._route.url != '/'){
        this._route.navigate([this._route.url]);
      }else{
        this._route.navigate(['login']);
      }
        return false;
   
  }
 
}