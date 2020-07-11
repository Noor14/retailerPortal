import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './../account.service';
import { validateAllFormFields, loadingConfig } from '../../../../constant/globalfunction';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from './../../../../services/shared.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-mpin',
  templateUrl: './create-mpin.component.html',
  styleUrls: ['./create-mpin.component.scss']
})
export class CreateMPINComponent implements OnInit {
  @Input() data: any = {};
  public createMPINForm: FormGroup;
  public showSpinner: boolean = false;
  public spinnerConfig:any;
  constructor(
    private _sharedService: SharedService,
    private _toast: ToastrService,
    private _accountService : AccountService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.createMPINForm = new FormGroup({
      mPin: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      AccountNumber: new FormControl({value:null, disabled:true}, [Validators.required, Validators.maxLength(14)]),
      AccountTitle: new FormControl({value:null, disabled:true}, Validators.required),
      CNIC: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
    });
    this.createMPINForm.patchValue(this.data);
  }

  createMPIN(){
    if(this.createMPINForm.invalid){
      validateAllFormFields(this.createMPINForm);
      
    }else{
      this.showSpinner = true;
      this._accountService.postCall(this.createMPINForm.value, 'account/mPinGeneration').then((res: any) => {
        if (res) {
        this._toast.success('MPIN created');
        this.gotoBack();
        }
      this.showSpinner = false;
      }, ((err: HttpErrorResponse) => {
        this._toast.error(err.message)
      this.showSpinner = false;
      }));
    }
  }

  gotoBack(){
    this._sharedService.setRenderComponent({
      redirect: 'linkedAccounts'
    });
  }

}
