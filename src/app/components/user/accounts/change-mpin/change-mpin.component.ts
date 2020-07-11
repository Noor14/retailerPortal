import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './../account.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { loadingConfig, validateAllFormFields } from './../../../../constant/globalfunction';
import { SharedService } from '../../../../services/shared.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-change-mpin',
  templateUrl: './change-mpin.component.html',
  styleUrls: ['./change-mpin.component.scss']
})
export class ChangeMPINComponent implements OnInit {
  @Input() data: string;
  public changeMPINForm: FormGroup;
  public oldMPINToggle: boolean = false;
  public newMPINToggle: boolean = false;
  public confirmMPINToggle: boolean = false;
  public showSpinner: boolean = false;
  public spinnerConfig:any;
  constructor(
    private _sharedService: SharedService,
    private _toast: ToastrService,
    private _accountService : AccountService
    ) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.changeMPINForm = new FormGroup({
      mPin: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      oldPin: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      confirmmPin: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      CNIC: new FormControl(this.data, [Validators.required, Validators.maxLength(13)]),
    });
  }
  gotoBack(){
    this._sharedService.setRenderComponent({
      redirect: 'linkedAccounts'
    });
  }
  changeMPIN() {
    if(this.changeMPINForm.invalid) {
      validateAllFormFields(this.changeMPINForm);
      
    }else{
      this.showSpinner = true;
      this._accountService.postCall(this.changeMPINForm.value, 'account/mPinChange').then((res: any) => {
        if (res) {
          this._toast.success('MPIN updated');
          this.gotoBack();
        }
      this.showSpinner = false;
      }, ((err: HttpErrorResponse) => {
        this._toast.error(err.message)
      this.showSpinner = false;
      }));
    }
  }
}
