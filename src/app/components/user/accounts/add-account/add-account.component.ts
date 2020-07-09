import { loadingConfig, validateAllFormFields } from './../../../../constant/globalfunction';
import { AppMasks } from '../../../../shared/app.mask';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './../account.service';
import { AppPattern } from '../../../../shared/app.mask';
import { SharedService } from '../../../../services/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  public accountLinkingForm: FormGroup;
  public channels: any[] = [];
  public selectedChannel;
  public selectedAccountType;
  public accountTypes: any[] = [];
  public bankTypeContainer: boolean = false;
  public showSpinner: boolean = false;
  public spinnerConfig:any;
  constructor(
    private _sharedService: SharedService,
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
    this.getChannel();
  }

  getChannel(){
    this._accountService.getCall('channel').then((res: any[]) => {
      if (res && res.length) {
        this.channels = res;
      }
    }, ((err: HttpErrorResponse) => {
      console.log(err);
    }));
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
      this.accountLinkingForm.controls.AccountTitle.setValue(this.channels.find(obj => obj.ID == this.selectedChannel).Name);
      this._accountService.postCall(this.accountLinkingForm.value, 'account/linking').then((res: any[]) => {
        if (res && res.length) {
          this.accountTypes = res;
          this.bankTypeContainer = true;
        }
      this.showSpinner = false;
      }, ((err: HttpErrorResponse) => {
        console.log(err);
      this.showSpinner = false;
      }));
    }
  
  }
  gotoBack(){
    this._sharedService.setRenderComponent('linkedAccounts');
  }

}
