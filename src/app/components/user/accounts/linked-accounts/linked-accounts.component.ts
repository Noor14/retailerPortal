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
  constructor(
    private _modalService: NgbModal,
    private _toast: ToastrService,
    private _sharedService: SharedService
  ) { 
  }

  ngOnInit() {
  }

  addAccount() {
    this._sharedService.setRenderComponent('addAccount');
  }
  removeAccount(id: number){
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
