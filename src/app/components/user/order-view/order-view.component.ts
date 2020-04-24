import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { loadingConfig } from './../../../constant/globalfunction';
import { OrderService } from '../order/order.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig:any;
  public orderPaymentDetailForm: FormGroup;
  private requestId: Number;
  public orderDetailList: any[] =[];
  public orderInfo:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _orderService: OrderService) {
    this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path)
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    if(this.requestId){
      this.getOrderDetails(this.requestId);
    }
    this.orderPaymentDetailForm = new FormGroup({
      CompanyName: new FormControl({value:null, disabled:true}, [Validators.required]),
      InvoiceNumber: new FormControl({value:null, disabled:true}, [Validators.required]),
      InvoiceCreatedDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      TransactionDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      BankName: new FormControl({value:null, disabled:true}, [Validators.required]),
      AuthID: new FormControl({value:null, disabled:true}, [Validators.required]),
      SettlementID: new FormControl({value:null, disabled:true}, [Validators.required]),
      InvoiceStatus: new FormControl({value:null, disabled:true}, [Validators.required]),
      InvoiceTotalAmount: new FormControl({value:null, disabled:true}, [Validators.required]),
      TransactionCharges: new FormControl({value:null, disabled:true}, [Validators.required]),
      TotalAmount: new FormControl({value:null, disabled:true}, [Validators.required]),
    });
  }

  getOrderDetails(requestId){
    this.showSpinner=true;
    this._orderService.getDetail(requestId).then((data: any) => {
    this.showSpinner=false;
    this.orderInfo = data.OrderPaymentDetails;
    this.orderDetailList = data.OrderDetails;
    data.OrderPaymentDetails.InvoiceCreatedDate =  moment(data.OrderPaymentDetails.InvoiceCreatedDate).format('DD-MM-YYYY');
    if(data.OrderPaymentDetails.TransactionDate){
      data.OrderPaymentDetails.TransactionDate =  moment(data.OrderPaymentDetails.TransactionDate).format('DD-MM-YYYY');
    }
    this.orderPaymentDetailForm.patchValue(data.OrderPaymentDetails);
  })
  .catch(err => {
    this.showSpinner=false;
  })
}
}
