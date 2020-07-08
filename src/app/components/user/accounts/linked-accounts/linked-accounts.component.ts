import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './../account.service';
import { SharedService } from '../../../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../../../../shared/dialog-modal/dialog/dialog.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.scss']
})
export class LinkedAccountsComponent implements OnInit {
  public linkedAccounts: any[] = new Array(14);
  constructor(
    private _modalService: NgbModal,
    private _toast: ToastrService,
    private _sharedService: SharedService,
    private _accountService: AccountService
  ) { }

  ngOnInit() {
    const userIdentity = (localStorage.getItem('userIdentity')) ? JSON.parse(localStorage.getItem('userIdentity')) : undefined;
    const retailerCode = (userIdentity && userIdentity.UserAccount) ? userIdentity.UserAccount.RetailerCode : null;
    this.getLinkedAccounts(retailerCode);
  }
  getLinkedAccounts(retailerCode){
    this._accountService.getCall(`account/${retailerCode}`).then(res => {
      if(res){
        console.log(res);
      }
    }, ((err: HttpErrorResponse) => {
      console.log(err);
    }));
  }
  addAccount() {
    this._sharedService.setRenderComponent('addAccount');
  }
  removeAccount(id :number){
    const modalRef = this._modalService.open(DialogComponent,{ 
      centered: true,
      keyboard: false,
      backdrop: 'static'
     });
    modalRef.componentInstance.obj = {id : id, title: 'Remove Account', titleTextColor: 'warning', mode: 'confirmDialog', type:'account', btnText: 'Remove', detail: `Are you sure, you want to remove this account? `};
    modalRef.result.then((result) => {
      if(result){
          // let index = this.linkedAccounts.findIndex(obj => obj.id == result)
          // this.linkedAccounts.splice(index, 1);
          // this.loadAvailableCount--
          this._toast.success('Account removed')
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  mpin(type){
      this._sharedService.setRenderComponent(type);
  }
  
}
