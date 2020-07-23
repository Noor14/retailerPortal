import { PaymentViewService } from './../../payment-view/payment-view.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from './../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { loadingConfig, validateAllFormFields } from './../../../../constant/globalfunction';
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
  private accountInfo:any = {};
  private payInfo:any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private _accountService: AccountService,
    private _paymentViewService: PaymentViewService,
    private _toast: ToastrService,
    private _route: Router
  ) {
    const id = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path);
    this.psID = this.activatedRoute.snapshot.url[2] && Number(this.activatedRoute.snapshot.url[2].path);
    this.amount = this.activatedRoute.snapshot.url[3] && Number(this.activatedRoute.snapshot.url[3].path);
    this.dealerCode = this.activatedRoute.snapshot.url[4] && Number(this.activatedRoute.snapshot.url[4].path);
    this.getBankInfo(id);
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    const userInfo = JSON.parse(localStorage.getItem('userIdentity')).UserAccount;
    this.payInfo.PaymentID = this.psID;
    this.payInfo.Amount = this.amount;
    this.payInfo.RetailerCode = userInfo.RetailerCode;
    this.payAccountForm = new FormGroup({
      PaymentID:  new FormControl({value:null, disabled:true}, [Validators.required]),
      mPin: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      RetailerCode: new FormControl({value:null, disabled:true}, [Validators.required]),
      BankAccountNumber: new FormControl({value:null, disabled:true}, [Validators.required]),
      Amount: new FormControl({value:null, disabled:true}, [Validators.required]),
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
        res.BankAccountNumber = data.AccountNumber;
        res.CNIC = data.CNIC;
        res.creditCNIC = res.creditCNIC.split('-').join('');
        this.accountInfo = res;
        this.payInfo.Charges = res.Charges;
        this.payInfo.Total = res.TotalAmount;
        this.payInfo.BankAccountNumber = res.BankAccountNumber;

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
        if(typeof res == 'string'){
          res = JSON.parse(res);
        }
        this.payInfo.AccountTitle = res.MAccountTitle;
        this.payInfo.Beneficiary = res.MBLFinTechResponse.HostData.ABDRsp.AccountTitle._text;
        this.payAccountForm.patchValue(this.payInfo);
      }
      this.showSpinner = false;
    }, ((err: HttpErrorResponse) => {
       this.showSpinner = false;
        this._toast.error(err.error.message || err.message);
    }));
  }

  pay(){
    if(this.payAccountForm.invalid) {
      validateAllFormFields(this.payAccountForm);
      
    }else{
      const obj ={
        Amount: this.payInfo.Amount,
        BankAccountNumber: this.accountInfo.BankAccountNumber,
        BankIMD: this.accountInfo.BankIMD,
        BankName: this.accountInfo.BankName,
        Beneficiary: this.payInfo.Beneficiary,
        CNIC: this.accountInfo.CNIC,
        Charges: this.payInfo.Charges,
        DealerCode: this.dealerCode,
        Total: this.payInfo.Total,
        creditAccount: this.accountInfo.creditBankAccountNumber,
        creditCNIC: this.accountInfo.creditCNIC,
        debitAccount: this.accountInfo.BankAccountNumber,
        debitCNIC: this.accountInfo.CNIC,
        mPin: this.payAccountForm.controls['mPin'].value,
        paymentNumber: this.psID
      };
      this.showSpinner = true;
      this._accountService.postCall(obj, 'payment/fundTransfer').then((res: any) => {
        if (res) {
          this._toast.success(res);
          this._route.navigate(['/user/dashboard']);
        }
          this.showSpinner = false;
      }, ((err: HttpErrorResponse) => {
          this.showSpinner = false;
          this._toast.error(err.error.message || err.message);
  
      }));
    }
  
  }

}
