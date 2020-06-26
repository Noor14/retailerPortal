import { CanComponentDeactivate } from './../../../services/deactivate.guard';
import { AppPattern } from '../../../shared/app.mask';
import { validateAllFormFields, loadingConfig } from './../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy, SecurityContext, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentInstructionComponent } from '../../../shared/dialog-modal/payment-instruction/payment-instruction.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentViewService } from '../payment-view/payment-view.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-payment-creation',
  templateUrl: './payment-creation.component.html',
  styleUrls: ['./payment-creation.component.scss']
})
export class PaymentCreationComponent implements OnInit, OnDestroy, OnChanges, CanComponentDeactivate {

  @Input() paymentDetail:any;
  @Input() requestType: number = 1;
  @Input() distributorList: any[] = [];
  public showSpinner:boolean;
  public spinnerConfig:any;
  public paymentForm: FormGroup; 
  public paymentPrepaidNumber:number = undefined;
  private paymentFormSubscriber:any;
  public updateBtn:boolean = false;
  public requestId:number;
  public orderInfo:any;
  public orderDetailList: any;
  public lstPayAxis: any = {};
  public errorState:any;
  public orderStatus:any;

  constructor(
    private _toast: ToastrService,
    private _modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private _paymentViewService: PaymentViewService,
    private _route: Router,
    private _domSanitizer: DomSanitizer
    ) {
      this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path);
      
     }
    canDeactivate(){
      if(this.paymentForm.dirty && !this.paymentPrepaidNumber){
        let object = this.paymentForm.value;
        if(Object.values(object).some(item => item)){
          return false;
        }else{
          return true;
        }
      }
      else if(this.paymentForm.dirty && this.paymentPrepaidNumber && this.updateBtn){
        return false;
      }
      else{
        return true;
      }
    }

    ngOnInit() 
    {
      
      this.payAxisMessage();
      this.spinnerConfig = loadingConfig;
      if(this.requestType){
        this.createForm();
        this.getDistributionList();
      }
    }
    createForm(){
      this.paymentForm= new FormGroup ({
        ID: new FormControl(0, Validators.required),
        DealerCode: new FormControl({value:null, disabled: !this.requestType && this.requestId},Validators.required),
        PaidAmount: new FormControl({value:null, disabled: !this.requestType && this.requestId},[
        Validators.required, Validators.min(500), Validators.maxLength(9), Validators.pattern(AppPattern.number)])
      })
    }
    ngOnChanges(){
      this.createForm();
        if(this.paymentDetail){
          this.paymentForm.patchValue(this.paymentDetail);
          this.paymentPrepaidNumber = this.paymentDetail.PrePaidNumber;
          this.orderStatus = this.paymentDetail.OrderStatus;
          this.paymentFormSubscriber && this.paymentFormSubscriber.unsubscribe();
          this.onChanges();
        }
    }

    getPaymentDetails(resourceName, requestId){
      this.showSpinner = true;
      this._paymentViewService.getDetail(resourceName, requestId).then((data: any) => {
      this.showSpinner = false;
      this.paymentForm.patchValue(data);
      this.paymentPrepaidNumber = data.PrePaidNumber;
      this.onChanges();
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }
    ngOnDestroy(){
        this.paymentFormSubscriber && this.paymentFormSubscriber.unsubscribe();
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
      this._paymentViewService.getDistributorsList()
      .then((res:any)=>{
        this.showSpinner=false;
        if(res && res.length){
          this.distributorList = res;
          if(this.requestId && this.requestType){
            this.getPaymentDetails('prepaidrequests', this.requestId);
          }
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
      this._paymentViewService.makePayment(this.paymentForm.value,8,"prepaidrequests/save")
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
      this.showSpinner = true;
      let id =  (this.paymentDetail && this.paymentDetail.InvoiceID)? this.paymentDetail.InvoiceID : this.requestId;
      let endPoint = (!this.requestType && this.requestId)? 'invoices/PrintInvoice' : 'prepaidrequests/printRecipt';
      this._paymentViewService.getVoucher(endPoint, id)
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
      let id =  (this.paymentDetail && this.paymentDetail.InvoiceID)? this.paymentDetail.InvoiceID : this.requestId;
      let endPoint = (!this.requestType && this.requestId)? 'invoices/PrintInvoice' : 'prepaidrequests/printRecipt';
      modalRef.componentInstance.obj = {PSID : this.paymentPrepaidNumber, VoucherNo: id, endPoint: endPoint};
      modalRef.result.then((result) => {
        if(result){
        }
      }, (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }


    bankPayment(selectedItem): void {


      console.log('button has been created');
      console.log(selectedItem);
      console.log(this.requestType);
     if(this.requestType && this.requestId)
     {
      this._paymentViewService.getJazzPaymentData('payaxis/PrePaidPay', selectedItem).then((data: any) => {
        //this.showSpinner = false;
        this.lstPayAxis = data;
        console.log(data);
        setTimeout(() => {
          const frmPayment = <HTMLFormElement>document.getElementById('frmPayment');
          frmPayment.submit();
      }, 100);
        
      }).catch(err=>{
        //this.showSpinner=false;
          if(err.error){
            this._toast.error(err.error.message, "Error")
          }
        })
     }

     //for invoice
     else
     {
      this._paymentViewService.getJazzPaymentData('payaxis/InvoicePay', selectedItem).then((data: any) => {
        //this.showSpinner = false;
        this.lstPayAxis = data;
        console.log(data);
        setTimeout(() => {
          const frmPayment = <HTMLFormElement>document.getElementById('frmPayment');
          frmPayment.submit();
      }, 100);
        
      }).catch(err=>{
        //this.showSpinner=false;
          if(err.error){
            this._toast.error(err.error.message, "Error")
          }
        })
       
     }
      

     /* this.dataservice.GetById('payaxis/PrePaidPay', selectedItem.ID, Rights.PrepaidRequest)
          .subscribe(data => {
              this.lstPayAxis = data;
              setTimeout(() => {
                  const frmPayment = <HTMLFormElement>document.getElementById('frmPayment');
                  frmPayment.submit();
              }, 100);

          }, error => {
              return error;
          });
          */



        

 


  }

           // JazzCash Message
payAxisMessage(): void {
  

this.activatedRoute.queryParams.subscribe(params => {
  if (params['error'] != undefined) {
      this.errorState = params['error'];
      
  }

  if(this.errorState == 'true')
  {
    this._toast.error("Payment has not been paid.","Error")
  }
  else if(this.errorState == 'false')
  {
    this._toast.success("Payment has been sent successfully");
  }

  const url: string = this._route.url.substring(0, this._route.url.indexOf('?'));
  this._route.navigateByUrl(url);
  
});
          
  }
}
