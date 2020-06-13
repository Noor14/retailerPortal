import { SharedService } from 'src/app/services/shared.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
// import { User } from '../models/user';
// import { Role } from '../models/role';
@Injectable({
  providedIn: 'root'
})
export class RoleAuthorizationService {
  
  private userRoles: any;
  constructor(private _sharedService : SharedService) {
    this.userRoles = this._sharedService.getUserRole();
    if(!this.userRoles){
      let info = localStorage.getItem('userIdentity');
      if(info){
       this.userRoles = JSON.parse(info).UserAccount.UserRights;
      }
    }
   }
    
    isAuthorized() {
        return this.userRoles && this.userRoles.length && !!this.userRoles;
    }

    hasRole(role) {
        return this.isAuthorized() && this.userRoles.some(obj => obj.RightId == role);
    }

 }

