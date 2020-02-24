import { loadingConfig } from './../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from './payment.service';
import { PaymentInstructionComponent } from '../../../shared/dialog-modal/payment-instruction/payment-instruction.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  constructor(
    private _paymentService: PaymentService,
    private _toast: ToastrService,
    private _modalService: NgbModal
    ) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;

    this.getDistributionList();
    this.paymentForm= new FormGroup ({
      ID: new FormControl(0),
      DealerCode: new FormControl(null,Validators.required),
      PaidAmount: new FormControl(null,Validators.required)
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
