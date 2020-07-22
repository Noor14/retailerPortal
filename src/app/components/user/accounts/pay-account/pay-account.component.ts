import { PaymentViewService } from './../../payment-view/payment-view.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './../account.service';
import { ActivatedRoute } from '@angular/router';
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
  public requestId: number;
  private amount: number;
  private dealerCode: number;
  private psID: number;
  public MPINToggle: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _accountService: AccountService,
    private _paymentViewService: PaymentViewService,
    private _toast: ToastrService,

  ) {
    const id = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path);
    this.psID = this.activatedRoute.snapshot.url[2] && Number(this.activatedRoute.snapshot.url[2].path);
    this.amount = this.activatedRoute.snapshot.url[3] && Number(this.activatedRoute.snapshot.url[3].path);
    this.dealerCode = this.activatedRoute.snapshot.url[4] && Number(this.activatedRoute.snapshot.url[4].path);
    this.getBankInfo(id);
   }

  ngOnInit() {
    const userInfo = JSON.parse(localStorage.getItem('userIdentity')).UserAccount;
    this.spinnerConfig = loadingConfig;
    this.payAccountForm = new FormGroup({
      PaymentID:  new FormControl({value:this.psID, disabled:true}, [Validators.required]),
      mPin: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      RetailerCode: new FormControl({value:userInfo.RetailerCode, disabled:true}, [Validators.required]),
      BankAccountNumber: new FormControl({value:null, disabled:true}, [Validators.required]),
      Amount: new FormControl({value:this.amount, disabled:true}, [Validators.required]),
      Beneficiary: new FormControl({value:null, disabled:true}, [Validators.required]),
      AccountTitle: new FormControl({value:null, disabled:true}, [Validators.required]),
      Charges: new FormControl({value:null, disabled:true}, [Validators.required]),
      Total: new FormControl({value:null, disabled:true},[Validators.required])
    });
  }
  getBankInfo(id){
    this.showSpinner = true;
    this._accountService.getById('account/readById', id).then((res: any) => {
      if (res) {
        console.log(res, 'getBankInfo');
        this.payAccountForm.controls['BankAccountNumber'].setValue(res.AccountNumber)
        this.getAccountInfo(this.amount, this.dealerCode, res);
      }else{
        this.showSpinner = false;
      }
    }, ((err: HttpErrorResponse) => {
        this.showSpinner = false;
        this._toast.error(err.error.message || err.message);

    }));
  }
  getAccountInfo(amount, dealerCode, data){
    const obj = {
      Amount: amount,
      DealerCode: dealerCode,
      PSID: this.psID
    };
    this._paymentViewService.postCall(obj, 'prepaidrequests/ReadByPaymentId').then((res: any) => {
      if (res) {
        console.log(res, 'accountinfo');
        res.BankAccountNumber = data.AccountNumber;
        res.CNIC = data.CNIC;
        res.creditCNIC = res.creditCNIC.split('-').join('');
        this.payAccountForm.controls['Charges'].setValue(res.Charges);
        this.payAccountForm.controls['Total'].setValue(res.TotalAmount);
        this.getTitleFetch(res);
      }else{
        this.showSpinner = false;
      }
    }, ((err: HttpErrorResponse) => {
        this.showSpinner = false;
        this._toast.error(err.error.message || err.message);

    }));
  }
  getTitleFetch(obj){
    this._accountService.postCall(obj, 'payment/getTitle').then((res: any) => {
      if (res) {
        console.log(res,'title')
        this.payAccountForm.controls['AccountTitle'].setValue(res.MAccountTitle);
        this.payAccountForm.controls['Beneficiary'].setValue(res.MBLFinTechResponse.HostData.ABDRsp.AccountTitle._text);
        // this.payAccountForm.patchValue(res);
      }
      this.showSpinner = false;
    }, ((err: HttpErrorResponse) => {
       this.showSpinner = false;
        this._toast.error(err.error.message || err.message);
    }));
  }

  pay(){
    console.log("pay")
  }

}
