import { loadingConfig } from './../../../constant/globalfunction';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentDetailService } from './payment-detail.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {

  public showSpinner: boolean;
  public spinnerConfig:any;
  public paymentDetailForm: FormGroup;
  private requestId: Number;
  private requestType: Number;

 constructor(
   private activatedRoute: ActivatedRoute,
   private _paymentDetailService: PaymentDetailService,
   private _toast: ToastrService,
   private _domSanitizer: DomSanitizer
   ) {
      this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path)
      this.requestType = (this.activatedRoute.snapshot.url[2])? Number(this.activatedRoute.snapshot.url[2].path) : 1;
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
      if(this.requestType){
        this.getPaymentDetails('prepaidrequests', this.requestId);
      }else{
        this.getPaymentDetails('invoices', this.requestId);
      }
    this.paymentDetailForm = new FormGroup({
      PrePaidNumber:  new FormControl({value:null, disabled:true}, [Validators.required]),
      PaidAmount: new FormControl({value:null, disabled:true}, [Validators.required]),
      CompanyName: new FormControl({value:null, disabled:true}, [Validators.required]),
      CreatedDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      AuthID: new FormControl({value:null, disabled:true}, [Validators.required]),
      BankName: new FormControl({value:null, disabled:true}, [Validators.required]),
      TransactionDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      TransactionCharges: new FormControl({value:null, disabled:true}, [Validators.required]),
      Status: new FormControl({value:null, disabled:true}, [Validators.required]),
      SettlementID: new FormControl({value:null, disabled:true},[Validators.required]),
      TotalAmount: new FormControl({value:null, disabled:true},[Validators.required])
    });
  }
  getPaymentDetails(resourceName, requestId){
      this.showSpinner=true;
    this._paymentDetailService.getDetail(resourceName, requestId).then((data: any) => {
      if(!this.requestType && this.requestId){
        data = data.Invoice;
      }
      data.CreatedDate =  moment(data.CreatedDate).format('DD-MM-YYYY');
      if(data.TransactionDate){
        data.TransactionDate =  moment(data.TransactionDate).format('DD-MM-YYYY');
      }
      this.paymentDetailForm.patchValue(data);
      this.showSpinner=false;
    })
    .catch((err:HttpErrorResponse) => {
      this.showSpinner=false;
      if(err.error){
        this._toast.error(err.error.message, "Error")
      }
    })
  }
  viewReceipt(){
      this.showSpinner=true;
      this._paymentDetailService.getDetail('prepaidrequests/paymentreceipt', this.requestId)
      .then((res:any)=>{
        this.showSpinner=false;
        if(res.data && res.data.length){
          let typedArray = new Uint8Array(res.data);
          const stringChar = typedArray.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
            }, '')
          let base64String = btoa(stringChar);
          let doc = this._domSanitizer.bypassSecurityTrustUrl(`data:application/octet-stream;base64, ${base64String}`) as string;
          doc = this._domSanitizer.sanitize(SecurityContext.URL, doc) ;
          const downloadLink = document.createElement("a");
          const fileName = "receipt.pdf";
          downloadLink.href = doc;
          downloadLink.download = fileName;
          downloadLink.click();
        }
  
      })
      .catch((err:HttpErrorResponse)=>{
        this.showSpinner=false;
          if(err.error){
            this._toast.error(err.error.message, "Error")
          }
        })
  }

}
