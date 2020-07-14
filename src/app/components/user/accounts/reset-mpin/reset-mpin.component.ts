import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './../account.service';
import { ToastrService } from 'ngx-toastr';
import { loadingConfig, validateAllFormFields } from './../../../../constant/globalfunction';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../../../services/shared.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reset-mpin',
  templateUrl: './reset-mpin.component.html',
  styleUrls: ['./reset-mpin.component.scss']
})
export class ResetMPINComponent implements OnInit {
  @Input() data: any = {};
  public resetMPINForm: FormGroup;
  public showSpinner: boolean = false;
  public spinnerConfig:any;
  public otpToggle: boolean = false;
  public newMPINToggle: boolean = false;
  public confirmMPINToggle: boolean = false;
  constructor(
    private _sharedService: SharedService,
    private _toast: ToastrService,
    private _accountService : AccountService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.resetMPINForm = new FormGroup({
      otp: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      mPin: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      confirmmPin: new FormControl(null, Validators.required),
    });
    this.resetMPIN();
  }
  resetMPIN(){
      this.showSpinner = true;
      this._accountService.postCall(this.data, 'account/mPinReset').then((res: any) => {
        if (res) {
        this._toast.success('MPIN created');
        this.gotoBack();
        }
      this.showSpinner = false;
      }, ((err: HttpErrorResponse) => {
        this._toast.error(err.error.message || err.message)
      this.showSpinner = false;
      }));
  }
  gotoBack(){
    this._sharedService.setRenderComponent({
      redirect: 'linkedAccounts'
    });
  }
}
