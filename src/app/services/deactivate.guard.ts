import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from './../shared/dialog-modal/dialog/dialog.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private _modalService: NgbModal){}
  canDeactivate(component: CanComponentDeactivate, 
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      if(!component.canDeactivate()){
      return this.openDialogBox().then(val => val);
      }else{
        return true;
      }
  }
  openDialogBox(){
    const modalRef = this._modalService.open(DialogComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static'
    });
    modalRef.componentInstance.obj = {btnText: 'Discard', titleTextColor: 'warning', title: 'Discard Changes', detail: 'Are you sure, you want to leave this page? Your changes will be discarded.', mode: 'confirmDialog'};
   return modalRef.result.then((result) => {
     return Promise.resolve(result);

    }, (reason) => {
      return Promise.resolve(false)
    });
    
  }
  
}
