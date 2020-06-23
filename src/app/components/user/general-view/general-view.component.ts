import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { loadingConfig } from './../../../constant/globalfunction';
import { OrderService } from '../order/order.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentViewService } from './../payment-view/payment-view.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-general-view',
  templateUrl: './general-view.component.html',
  styleUrls: ['./general-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralViewComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig:any;
  public activeTab: string = "order";
  private requestId: number;
  public orderDetailList: any;
  public orderInfo:any;
  public viewType: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _paymentViewService: PaymentViewService,
    private _toast: ToastrService,
    private _orderService: OrderService ) {
    this.viewType = this.activatedRoute.snapshot.url[0] && this.activatedRoute.snapshot.url[0].path;
    this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path)
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    if(this.requestId && this.viewType == 'orderView'){
      this.getOrderDetails(this.requestId);
    }
    else if(this.requestId && this.viewType == 'invoiceView'){
        this.getPaymentDetails('invoices', this.requestId);
        this.activeTab = "payment"
    }
  }
  getPaymentDetails(resourceName, requestId){
    this.showSpinner=true;
    this._paymentViewService.getDetail(resourceName, requestId).then((data: any) => {
    this.orderInfo =  data.Invoice;
    this.orderDetailList = {orderDetails: data.OrderDetails, orderTotalDiscount: this.orderInfo.OrderTotalDiscount, invoiceUpload: this.orderInfo.InvoiceUpload};
    this.showSpinner = false;
  })
  .catch((err:HttpErrorResponse) => {
    this.showSpinner=false;
    if(err.error){
      this._toast.error(err.error.message, "Error")
    }
  })
}
  getOrderDetails(requestId){
    this.showSpinner = true;
    this._orderService.getDetail(requestId).then((data: any) => {
    this.showSpinner = false;
    this.orderInfo = data.OrderPaymentDetails;
    this.orderDetailList = {orderDetails: data.OrderDetails, orderTotalDiscount: this.orderInfo.OrderTotalDiscount, invoiceUpload: this.orderInfo.InvoiceUpload};
  })
  .catch(err => {
    this.showSpinner=false;
  })
}
}
