import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppMasks, AppPattern } from 'src/app/shared/app.mask';
import { loadingConfig } from 'src/app/constant/globalfunction';
import { Component, OnInit } from '@angular/core';
import { OrderDetailService } from '../order-detail/order-detail.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  public cnicMask = AppMasks.cnic_Mask;
  public mobileMask = AppMasks.mobile_Mask;
  public showSpinner: boolean;
  public spinnerConfig: any;
  public kycList: any[]= [];
  public selectedCompany: string= undefined;
  public companyDetailForm: FormGroup;
  constructor(private _orderDetailService : OrderDetailService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    let userObject = JSON.parse(localStorage.getItem('userIdentity')).UserAccount;
    this.getKYCList(userObject.RetailerID);
    this.companyDetailForm = new FormGroup({
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      CNIC: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      CompanyName: new FormControl(null, [Validators.required]),
      CompanyNTN: new FormControl(null, [Validators.required]),
      Address: new FormControl(null, [Validators.required]),
    });
  }

  getKYCList(requestId){
    this.showSpinner=true;
    this._orderDetailService.getKYCListDetail('kyc/ConnectedKycList',requestId).then((data: any) => {
      this.kycList = data;
      this.showSpinner=false;
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }
  companyDetail(dealerCode){
    let obj = this.kycList.find(obj=> obj.DealerCode == dealerCode);
    this.companyDetailForm.patchValue(obj);
  }

  companyProducts(dealerCode){
    this.showSpinner=true;
    this._orderDetailService.getKYCListDetail('products/GetProductByDealerCode', dealerCode).then((data: any) => {
      console.log(data)
      this.showSpinner=false;
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }

}
