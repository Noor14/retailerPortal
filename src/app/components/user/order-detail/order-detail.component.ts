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
  public netAmount: number = 0;
  public totalDiscount: number = 0;
  public grossAmount: number =0;

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
      CompanyName: new FormControl({value:null, disabled:true}, [Validators.required]),
      OrderNumber: new FormControl({value:null, disabled:true}, [Validators.required]),
      OrderCreatedDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      OrderStatus: new FormControl({value:null, disabled:true}, [Validators.required]),
      Comment: new FormControl({value:null, disabled:true}, [Validators.required]),
    });
    this.orderPaymentDetailForm = new FormGroup({
      CompanyName: new FormControl({value:null, disabled:true}, [Validators.required]),
      InvoiceNumber: new FormControl({value:null, disabled:true}, [Validators.required]),
      InvoiceCreatedDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      TransactionDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      BankName: new FormControl({value:null, disabled:true}, [Validators.required]),
      AuthID: new FormControl({value:null, disabled:true}, [Validators.required]),
      SettlementID: new FormControl({value:null, disabled:true}, [Validators.required]),
      InvoiceStatus: new FormControl({value:null, disabled:true}, [Validators.required]),
      PaidAmount: new FormControl({value:null, disabled:true}, [Validators.required]),
      TransactionCharges: new FormControl({value:null, disabled:true}, [Validators.required]),
      InvoiceTotalAmount: new FormControl({value:null, disabled:true}, [Validators.required]),
    });
  }
  getOrderDetails(requestId){
    this.showSpinner=true;
    this._orderDetailService.getDetail(requestId).then((data: any) => {
    this.showSpinner=false;
    this.orderDetaiList = data.OrderDetails;
    data.OrderPaymentDetails.OrderCreatedDate =  moment(data.OrderPaymentDetails.OrderCreatedDate).format('DD-MM-YYYY');
    data.OrderPaymentDetails.InvoiceCreatedDate =  moment(data.OrderPaymentDetails.InvoiceCreatedDate).format('DD-MM-YYYY');
    if(data.OrderPaymentDetails.TransactionDate){
      data.OrderPaymentDetails.TransactionDate =  moment(data.OrderPaymentDetails.TransactionDate).format('DD-MM-YYYY');
    }
    this.orderDetailForm.patchValue(data.OrderPaymentDetails);
    this.orderPaymentDetailForm.patchValue(data.OrderPaymentDetails);
    this.orderDetaiList.forEach(obj => {
      this.netAmount += obj.TotalPrice;
      this.grossAmount += obj.UnitPrice * obj.OrderQty * obj.PackSize;
      this.totalDiscount += obj.Discount * obj.OrderQty * obj.PackSize;
    });
  })
  .catch(err => {
    this.showSpinner=false;
  })
}
}
