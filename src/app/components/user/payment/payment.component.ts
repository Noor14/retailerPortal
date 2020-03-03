import { loadingConfig } from './../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from './payment.service';
import { PaymentInstructionComponent } from '../../../shared/dialog-modal/payment-instruction/payment-instruction.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentDetailService } from '../payment-details/payment-detail.service';
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
  constructor(
    private _paymentService: PaymentService,
    private _toast: ToastrService,
    private _modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private _paymentDetailService: PaymentDetailService,
    private _route: Router
    ) {
      this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path)
     }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    if(this.requestId){
      this.getPaymentDetails('prepaidrequests', this.requestId);
    }

    this.getDistributionList();
    this.paymentForm= new FormGroup ({
      ID: new FormControl(0),
      DealerCode: new FormControl(null,Validators.required),
      PaidAmount: new FormControl(null,Validators.required)
    })
  }

  getPaymentDetails(resourceName, requestId){
    this.showSpinner=true;
    this._paymentDetailService.getDetail(resourceName, requestId).then((data: any) => {
    this.showSpinner=false;
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
    this.showSpinner=true;
    this._paymentService.makePayment(this.paymentForm.value,8,"prepaidrequests/save")
    .then((data:any)=>{
    this.showSpinner=false;
      if(data && data.ID){
        (this.paymentForm.value.ID)? this._toast.success("Payment updated"): this._toast.success("Payment created");
        this.paymentPrepaidNumber = data.PrePaidNumber;
        this.paymentForm.controls['ID'].setValue(data.ID);
        if(!this.updateBtn){
          this.onChanges();
        }else{
          this.updateBtn = false;
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
    this._paymentService.getVoucher(this.requestId)
    .then((succ:any)=>{
      this.showSpinner=false;
      if(succ){
        console.log(succ)
      }
    })
    .catch(err=>{
      this.showSpinner=false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
  }

  openDialog(id :Number){
    const modalRef = this._modalService.open(PaymentInstructionComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static',
      size:'lg'
     });
    modalRef.componentInstance.obj = {PSID : this.paymentPrepaidNumber, VoucherNo: 'Delete Ticket'};
    modalRef.result.then((result) => {
      if(result){
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
