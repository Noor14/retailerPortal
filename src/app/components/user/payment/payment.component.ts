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

  public paymentForm: FormGroup; 
  public distributorList:any[];
  public paymentID:number = undefined;
  constructor(
    private _paymentService: PaymentService,
    private _toast: ToastrService
    ) { }

  ngOnInit() {
    this.getDistributionList();
    this.paymentForm= new FormGroup ({
      ID: new FormControl(0),
      DealerCode: new FormControl(null,Validators.required),
      PaidAmount: new FormControl(null,Validators.required)
    })
    
  }
  getDistributionList(){
    this._paymentService.getDistributorsList()
    .then((res:any)=>{
      if(res && res.length)
      this.distributorList = res
    })
  }


  savePayment(){
    this._paymentService.makePayment(this.paymentForm.value,8,"prepaidrequests/save")
    .then((data:any)=>{
      if(data && data.ID){
        this._toast.success("Payment created");
        this.paymentID = data.ID;
      }
    })
    .catch(err=>{
      console.log(err);
      if(err.error.status == 405){
        this._toast.error(err.error.message,"Error")
      }
    })
  }
}
