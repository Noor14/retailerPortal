import { AppPattern } from './../../../shared/app.mask';
import { loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentDetailService } from './payment-detail.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {

  private editable: boolean = true;
  public showSpinner: boolean;
  public spinnerConfig: any;
  public paymentDetailForm: FormGroup;
  public requestId: Number;

 constructor(
   private activatedRoute: ActivatedRoute,
   private _paymentDetailService: PaymentDetailService
   ) {
      this.requestId = Number(this.activatedRoute.snapshot.url[1].path)
      
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    let userObj = JSON.parse(localStorage.getItem('userIdentity')).UserAccount
      if(Number(this.activatedRoute.snapshot.url[2].path)){
        this.getPaymentDetails('prepaidrequests', this.requestId);
      }else{
        this.getPaymentDetails('invoicerequests', this.requestId);
      }
    this.paymentDetailForm = new FormGroup({
      ID: new FormControl(0),
      MobileNumber: new FormControl(userObj.RetailerMobile, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      Email: new FormControl(userObj.RetailerEmail, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      ContactName: new FormControl(userObj.CompanyName, [Validators.required]),
      PreferredContactMethod: new FormControl({ value: null, disabled: !this.editable }, [Validators.required]),
      Criticality: new FormControl({ value: null, disabled: !this.editable }, [Validators.required]),
      IssueType: new FormControl({ value: null, disabled: !this.editable }, [Validators.required]),
      Description: new FormControl({ value: null, disabled: !this.editable })
    });
  }
  getPaymentDetails(resourceName, requestId){
      this.showSpinner=true;
    this._paymentDetailService.getDetail(resourceName, requestId).then((data: any) => {
      this.showSpinner=false;
      console.log(data)
      this.paymentDetailForm.patchValue(data);
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }

}
