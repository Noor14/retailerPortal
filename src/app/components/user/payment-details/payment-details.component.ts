import { AppPattern } from './../../../shared/app.mask';
import { loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentDetailService } from './payment-detail.service';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {

  public showSpinner: boolean;
  public spinnerConfig: any;
  public paymentDetailForm: FormGroup;
  private requestId: Number;
  private requestType: Number;

 constructor(
   private activatedRoute: ActivatedRoute,
   private _paymentDetailService: PaymentDetailService
   ) {
      this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path)
      this.requestType = this.activatedRoute.snapshot.url[2] && Number(this.activatedRoute.snapshot.url[2].path);
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    // let userObj = JSON.parse(localStorage.getItem('userIdentity')).UserAccount
      if(this.requestType){
        this.getPaymentDetails('prepaidrequests', this.requestId);
      }else{
        this.getPaymentDetails('invoices', this.requestId);
      }
    this.paymentDetailForm = new FormGroup({
      ID: new FormControl(0),
      PrePaidNumber:  new FormControl({ value: null, disabled: true }, [Validators.required]),
      PaidAmount: new FormControl({ value: null, disabled: true }, [Validators.required]),
      CompanyName: new FormControl({ value: null, disabled: true }, [Validators.required]),
      CreatedDate: new FormControl({ value: null, disabled: true }, [Validators.required]),
      AuthID: new FormControl({ value: null, disabled: true }, [Validators.required]),
      BankName: new FormControl({ value: null, disabled: true }, [Validators.required]),
      TransactionDate: new FormControl({ value: null, disabled: true }, [Validators.required]),
      TransactionTime: new FormControl({ value: null, disabled: true }, [Validators.required]),
      IssueType: new FormControl({ value: null, disabled: true }, [Validators.required]),
      SettlementID: new FormControl({ value: null, disabled: true },[Validators.required])
    });
  }
  getPaymentDetails(resourceName, requestId){
      this.showSpinner=true;
    this._paymentDetailService.getDetail(resourceName, requestId).then((data: any) => {
      this.showSpinner=false;
      data.CreatedDate =  moment(data.CreatedDate).format('DD-MM-YYYY');
      data.TransactionTime =  moment(data.TransactionDate).format('h:mm a');
      data.TransactionDate =  moment(data.TransactionDate).format('DD-MM-YYYY');
      this.paymentDetailForm.patchValue(data);
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }

}
