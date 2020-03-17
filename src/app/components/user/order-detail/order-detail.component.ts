import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { loadingConfig } from './../../../constant/globalfunction';
import { OrderDetailService } from './order-detail.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig: any;
  public orderDetailForm: FormGroup;
  public orderPaymentDetailForm: FormGroup;
  private requestId: Number;
  public orderDetaiList: any[] =[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private _orderDetailService: OrderDetailService) {
    this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path)
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;

    if(this.requestId){
      this.getOrderDetails(this.requestId);
    }
    this.orderDetailForm = new FormGroup({
      CompanyName: new FormControl(null, [Validators.required]),
      OrderNumber: new FormControl(null, [Validators.required]),
      OrderCreatedDate: new FormControl(null, [Validators.required]),
      OrderStatus: new FormControl(null, [Validators.required]),
      Comment: new FormControl(null, [Validators.required]),
    });
    this.orderPaymentDetailForm = new FormGroup({
      CompanyName: new FormControl(null, [Validators.required]),
      InvoiceNumber: new FormControl(null, [Validators.required]),
      InvoiceCreatedDate: new FormControl(null, [Validators.required]),
      TransactionDate: new FormControl(null, [Validators.required]),
      BankName: new FormControl(null, [Validators.required]),
      AuthID: new FormControl(null, [Validators.required]),
      SettlementID: new FormControl(null, [Validators.required]),
      InvoiceStatus: new FormControl(null, [Validators.required]),
      PaidAmount: new FormControl(null, [Validators.required]),
      TransactionCharges: new FormControl(null, [Validators.required]),
      InvoiceTotalAmount: new FormControl(null, [Validators.required]),
    });
  }
  getOrderDetails(requestId){
    this.showSpinner=true;
  this._orderDetailService.getDetail(requestId).then((data: any) => {
    this.showSpinner=false;
    this.orderDetaiList = data.OrderDetails;
    data.OrderPaymentDetails.OrderCreatedDate =  moment(data.OrderPaymentDetails.OrderCreatedDate).format('DD-MM-YYYY');
    data.OrderPaymentDetails.InvoiceCreatedDate =  moment(data.OrderPaymentDetails.InvoiceCreatedDate).format('DD-MM-YYYY');
    data.OrderPaymentDetails.TransactionDate =  moment(data.OrderPaymentDetails.TransactionDate).format('DD-MM-YYYY');
    this.orderDetailForm.patchValue(data.OrderPaymentDetails);
    this.orderPaymentDetailForm.patchValue(data.OrderPaymentDetails);
  })
  .catch(err => {
    this.showSpinner=false;
  })
}
}
