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
  public selectedAccount;
  public selectedAccountType;
  constructor(private _sharedService: SharedService) { }

  ngOnInit() {
    this.accountLinkingForm = new FormGroup({
      ID: new FormControl(null, [Validators.required, Validators.min(0)]),
      Name: new FormControl(null, [Validators.required]),
      RetailerCode: new FormControl({value:null, disabled:true}, [Validators.required]),
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      CNIC: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      Address: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      CreatedDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      CompanyName: new FormControl(null, [Validators.required]),
    });
  }
  accountInfo(id){
    console.log(id)
  }
  gotoBack(){
    this._sharedService.setRenderComponent('linkedAccounts');
  }

}
