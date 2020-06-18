import { loadingConfig } from '../../../constant/globalfunction';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SecurityContext, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentViewService } from './payment-view.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit, OnChanges {

  @Input() paymentDetail: any;
  @Input() viewType: string = 'payment';
  public showSpinner: boolean;
  public spinnerConfig: any;
  public paymentDetailForm: FormGroup;
  private requestId: number;
  public requestType: number = 1;

 constructor(
   private activatedRoute: ActivatedRoute,
   private _paymentViewService: PaymentViewService,
   private _toast: ToastrService,
   private _domSanitizer: DomSanitizer
   ) {
      this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path);
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
      if(this.viewType == 'payment'){
        this.createForm()
        this.getPaymentDetails('prepaidrequests', this.requestId);
      }
  }
  ngOnChanges(){
    this.createForm();
    if(this.paymentDetail){
      if(this.viewType == 'orderView'){
        this.paymentDetail.PrePaidNumber = this.paymentDetail.InvoiceNumber;
        this.paymentDetail.Status = this.paymentDetail.InvoiceStatus;
        this.paymentDetail.PaidAmount = this.paymentDetail.InvoiceTotalAmount;
        if(this.paymentDetail.InvoiceCreatedDate && moment(this.paymentDetail.InvoiceCreatedDate).isValid()){
          this.paymentDetail.CreatedDate =  moment(this.paymentDetail.InvoiceCreatedDate).format('DD-MM-YYYY');
        } else{
          this.paymentDetail.CreatedDate =  this.paymentDetail.InvoiceCreatedDate;
        }
      }
      else if (this.viewType == 'invoiceView'){
        if(this.paymentDetail.OrderCreatedDate && moment(this.paymentDetail.OrderCreatedDate).isValid()){
          this.paymentDetail.CreatedDate =  moment(this.paymentDetail.OrderCreatedDate).format('DD-MM-YYYY');
        } else{
          this.paymentDetail.CreatedDate =  this.paymentDetail.OrderCreatedDate;
        }
      }
      if(this.paymentDetail.TransactionDate){
        this.paymentDetail.TransactionDate =  moment(this.paymentDetail.TransactionDate).format('DD-MM-YYYY');
      }
     
      this.paymentDetailForm.patchValue(this.paymentDetail);
    }
  }
  createForm(){
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
    this._paymentViewService.getDetail(resourceName, requestId).then((data: any) => {
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
      let endPoint = (this.viewType != 'payment')? 'invoices/receipt' : 'prepaidrequests/paymentreceipt';
      this._paymentViewService.getDetail(endPoint, this.requestId)
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
