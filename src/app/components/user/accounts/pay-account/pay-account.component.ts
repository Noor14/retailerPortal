import { loadingConfig } from './../../../../constant/globalfunction';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pay-account',
  templateUrl: './pay-account.component.html',
  styleUrls: ['./pay-account.component.scss']
})
export class PayAccountComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig: any;
  public payAccountForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.payAccountForm = new FormGroup({
      PrePaidNumber:  new FormControl({value:null, disabled:true}, [Validators.required]),
      PaidAmount: new FormControl({value:null, disabled:true}, [Validators.required]),
      CompanyName: new FormControl({value:null, disabled:true}, [Validators.required]),
      CreatedDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      AuthID: new FormControl({value:null, disabled:true}, [Validators.required]),
      BankName: new FormControl({value:null, disabled:true}, [Validators.required]),
      TransactionDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      TransactionCharges: new FormControl({value:null, disabled:true}, [Validators.required]),
      TotalAmount: new FormControl({value:null, disabled:true},[Validators.required])
    });
  }
  pay(){
    console.log("pay")
  }

}
