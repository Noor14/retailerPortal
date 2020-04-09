import { AppPattern } from '../../../shared/app.mask';
import { loadingConfig, validateAllFormFields } from './../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy, SecurityContext } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from './payment.service';
import { PaymentInstructionComponent } from '../../../shared/dialog-modal/payment-instruction/payment-instruction.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentDetailService } from '../payment-details/payment-detail.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy{
  public spinnerConfig:any;
  public showSpinner:boolean;
  public paymentForm: FormGroup; 
  public distributorList:any[];
  public paymentPrepaidNumber:number = undefined;
  private paymentFormSubscriber:any;
  public updateBtn:boolean = false;
  private requestId:Number;
  public requestType: Number;
  constructor(
    private _paymentService: PaymentService,
    private _toast: ToastrService,
    private _modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private _paymentDetailService: PaymentDetailService,
    private _route: Router,
    private _domSanitizer: DomSanitizer
    ) {
      this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path);
      this.requestType = (this.activatedRoute.snapshot.url[2])? Number(this.activatedRoute.snapshot.url[2].path) : 1;
     }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    if(this.requestId){
      if(this.requestType){
        this.getPaymentDetails('prepaidrequests', this.requestId);
      }else{
        this.getPaymentDetails('invoices', this.requestId);
      }
    }

    this.getDistributionList();
    this.paymentForm= new FormGroup ({
      ID: new FormControl(0, Validators.required),
      DealerCode: new FormControl({value:null, disabled: !this.requestType && this.requestId},Validators.required),
      PaidAmount: new FormControl({value:null, disabled: !this.requestType && this.requestId},[
     Validators.required, Validators.min(500), Validators.maxLength(9), Validators.pattern(AppPattern.number)])
    })
  }

  getPaymentDetails(resourceName, requestId){
    this.showSpinner=true;
    this._paymentDetailService.getDetail(resourceName, requestId).then((data: any) => {
    this.showSpinner=false;
    if(!this.requestType && this.requestId){
      data = data.Invoice;
      data.PaidAmount = data.TotalAmount;
    }
    this.paymentForm.patchValue(data);
    this.paymentPrepaidNumber = data.PrePaidNumber;
    this.onChanges();
  })
  .catch(err => {
    this.showSpinner=false;
  })
}
  ngOnDestroy(){
    if(this.paymentFormSubscriber){
      this.paymentFormSubscriber.unsubscribe();
    }
  }

  onChanges():void{
    this.paymentFormSubscriber = this.paymentForm.valueChanges.subscribe(val => {
      if(val && Object.keys(val).length){
        if(this.paymentPrepaidNumber){
          this.updateBtn = true;
        }
        
      }
    });
  }
  getDistributionList(){
    this.showSpinner=true;
    this._paymentService.getDistributorsList()
    .then((res:any)=>{
      this.showSpinner=false;
      if(res && res.length){
        this.distributorList = res
      }
    })
    .catch(err=>{
      this.showSpinner=false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
  }

  savePayment(){
    if(this.paymentForm.valid){
    this.showSpinner=true;
    this._paymentService.makePayment(this.paymentForm.value,8,"prepaidrequests/save")
    .then((data:any)=>{
    this.showSpinner=false;
      if(data && data.ID){
        (this.paymentForm.value.ID)? this._toast.success("Payment updated"): this._toast.success("Payment created");
        this.paymentPrepaidNumber = data.PrePaidNumber;
        this.paymentForm.controls['ID'].setValue(data.ID);
        this.requestId = data.ID;
        if(!this.updateBtn){
          this.onChanges();
        }else{
          if(this.paymentFormSubscriber){
            this.paymentFormSubscriber.unsubscribe();
            this.updateBtn = false;
            this.onChanges();
          }
        }
       
      }
    })
    .catch(err=>{
    this.showSpinner=false;
      if(err.error.status == 405){
        this._toast.error(err.error.message, "Error")
      }
    })
  }
  else{
     validateAllFormFields(this.paymentForm);
   }
  }
  resetForm(){
    this.paymentPrepaidNumber = undefined;
    this.paymentForm.reset();
    this.paymentForm.controls['ID'].setValue(0);
    // if(this.requestId){
    //   this._route.navigate(['/user/payment'])
    // }
  }

  viewVoucher(){
    this.showSpinner=true;
    let endPoint = (!this.requestType && this.requestId)? 'invoices/PrintInvoice' :'prepaidrequests/printRecipt';
    this._paymentService.getVoucher(endPoint, this.requestId)
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
        const fileName = "voucher.pdf";
        downloadLink.href = doc;
        downloadLink.download = fileName;
        downloadLink.click();
      }

    })
    .catch(err=>{
      this.showSpinner=false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
  }

  openDialog(){
    const modalRef = this._modalService.open(PaymentInstructionComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static',
      size:'lg'
     });
    modalRef.componentInstance.obj = {PSID : this.paymentPrepaidNumber, VoucherNo: this.requestId};
    modalRef.result.then((result) => {
      if(result){
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
