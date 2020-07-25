import { ToastrService } from 'ngx-toastr';
import { loadingConfig, validateAllFormFields } from './../../../../constant/globalfunction';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './../account.service';
import { SharedService } from '../../../../services/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  @Input() data: any[] = [];
  public accountLinkingForm: FormGroup;
  public selectedChannel;
  public selectedAccountType;
  public accountTypes: any[] = [];
  public bankTypeContainer: boolean = false;
  public showSpinner: boolean = false;
  public spinnerConfig:any;
  constructor(
    private _sharedService: SharedService,
    private _toast: ToastrService,
    private _accountService : AccountService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    const userInfo = JSON.parse(localStorage.getItem('userIdentity')).UserAccount;
    this.accountLinkingForm = new FormGroup({
      ID: new FormControl(0, [Validators.required, Validators.min(0)]),
      UserName: new FormControl(userInfo.Username, Validators.required),
      UserCode: new FormControl(userInfo.RetailerCode, Validators.required),
      MobileNumber: new FormControl(userInfo.RetailerMobile, Validators.required),
      AccountNumber: new FormControl(null, [Validators.required, Validators.maxLength(14)]),
      BankID: new FormControl(null, Validators.required),
      ChannelID: new FormControl(null, Validators.required),
      AccountTitle: new FormControl(null),
      CNIC: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
    });
  }



  accountInfo(id){
    this._accountService.getById('channel', id).then((res: any[]) => {
      if (res && res.length) {
        this.accountTypes = res;
        this.bankTypeContainer = true;
      }
    }, ((err: HttpErrorResponse) => {
      console.log(err);
    }));
  }

  addAccount(){
    if(this.accountLinkingForm.invalid){
      validateAllFormFields(this.accountLinkingForm);
      
    }else{
      this.showSpinner = true;
      this.accountLinkingForm.controls.AccountTitle.setValue(this.data.find(obj => obj.ID == this.selectedChannel).Name);
      this._accountService.postCall(this.accountLinkingForm.value, 'account/linking').then((res: any) => {
        if (res) {
        this._toast.success('Your Meezan Bank account has been lined successfully.', 'Account Linked');
        res.NewCreated = true;
        res.redirectFrom = 'addAccount';
        this.redirectMPIN('createMPIN', res);
        }
      this.showSpinner = false;
      }, ((err: HttpErrorResponse) => {
        this._toast.error(err.error.message || err.message);
        this.showSpinner = false;
      }));
    }
  
  }
  redirectMPIN(type, obj){
    obj.redirectFor = type;
    this._sharedService.setRenderComponent({
      redirect: type,
      data: obj
    });
}
  gotoBack(){
    this._sharedService.setRenderComponent({
      redirect: 'linkedAccounts'
    });
  }

}
