import { loadingConfig } from './../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  public spinnerConfig:any;
  public showSpinner:boolean;
  public paymentForm: FormGroup; 
  public distributorList:any[];
  public paymentID:number = undefined;
  constructor(
    private _paymentService: PaymentService,
    private _toast: ToastrService
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
        this._toast.success("Payment created");
        this.paymentID = data.ID;
      }
    })
    .catch(err=>{
    this.showSpinner=false;
      if(err.error.status == 405){
        this._toast.error(err.error.message, "Error")
      }
    })
  }
}
