import { AccountService } from './../account.service';
import { loadingConfig } from './../../../../constant/globalfunction';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../../../../shared/dialog-modal/dialog/dialog.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.scss']
})
export class LinkedAccountsComponent implements OnInit {
  @Input() data: any[] = [];
  public showSpinner: boolean = false;
  public spinnerConfig:any;
  constructor(
    private _modalService: NgbModal,
    private _toast: ToastrService,
    private _sharedService: SharedService,
    private _accountService: AccountService
  ) { 
  }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;

  }

  addAccount() {
    this._sharedService.setRenderComponent({
      redirect: 'addAccount'
    });
  }
  removeAccount(item){
    const modalRef = this._modalService.open(DialogComponent, {
      centered: true,
      keyboard: false,
      backdrop: 'static'
     });
    modalRef.componentInstance.obj = {
      accountNumber: item.AccountNumber,
      CNIC: item.CNIC,
      ID: item.ID,
      title: 'Remove Account',
      titleTextColor: 'warning',
      mode: 'confirmDialog',
      type: 'accountDelinking',
      btnText: 'Remove',
      detail: 'Are you sure, you want to remove this account?'
    };
    modalRef.result.then((result) => {
      if(result){
          const index = this.data.findIndex(obj => obj.ID == item.ID);
          if(index >=0){
            this.data.splice(index, 1);
          }
          this._toast.success('Account removed');
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  redirectMPIN(type, obj){
      obj.redirectFor = type;
      this._sharedService.setRenderComponent({
        redirect: (type == 'resetMPIN')? 'changeMPIN' : type,
        data: obj
      });
  }
  resetMPIN(obj){
    this.showSpinner = true;
    this._accountService.postCall(obj, 'account/mPinReset').then((res: any) => {
      if (res) {
      this._toast.success('OTP send');
      this.redirectMPIN('resetMPIN', obj);
      }
    this.showSpinner = false;
    }, ((err: HttpErrorResponse) => {
      this._toast.error(err.error.message || err.message);
    this.showSpinner = false;
    }));
}
  
}
