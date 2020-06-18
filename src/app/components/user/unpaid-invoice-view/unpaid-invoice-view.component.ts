import { OrderService } from './../order/order.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { loadingConfig } from './../../../constant/globalfunction';
import { PaymentViewService } from './../payment-view/payment-view.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-unpaid-invoice-view',
  templateUrl: './unpaid-invoice-view.component.html',
  styleUrls: ['./unpaid-invoice-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnpaidInvoiceViewComponent implements OnInit {
  public distributorList:any[] = [];
  public requestId: number;
  public requestType: number = 0;
  public showSpinner: boolean;
  public spinnerConfig: any;
  public orderInfo: any;
  public orderDetailList: any;
  public viewType: string = "payment-invoice";
  public activeTab: string = "payment";
  constructor(
    private activatedRoute: ActivatedRoute,
    private _toast: ToastrService,
    private _orderService: OrderService,
    private _paymentViewService: PaymentViewService
    ) {
      this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path);
      this.viewType = this.activatedRoute.snapshot.url[0] && this.activatedRoute.snapshot.url[0].path;
     }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getDistributionList();
    if(this.viewType == 'order-invoice'){
      this.activeTab = 'order';
    }
    
    }
    getOrderDetails(requestId){
      this.showSpinner = true;
      this._orderService.getDetail(requestId).then((data: any) => {
      this.showSpinner = false;
      this.orderInfo = data.OrderPaymentDetails;
      this.orderInfo.PaidAmount = this.orderInfo.TotalAmount;
      this.orderInfo.PrePaidNumber = this.orderInfo.InvoiceNumber
      this.orderDetailList = {orderDetails: data.OrderDetails, orderTotalDiscount: this.orderInfo.OrderTotalDiscount};
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }
  getPaymentDetails(resourceName, requestId){
    this.showSpinner = true;
    this._paymentViewService.getDetail(resourceName, requestId).then((data: any) => {
    this.showSpinner = false;
      this.orderDetailList = {orderDetails: data.OrderDetails, orderTotalDiscount: data.Invoice && data.Invoice.OrderTotalDiscount};
      data = data.Invoice;
      data.PaidAmount = data.TotalAmount;
      this.orderInfo = data;
    
  })
  .catch(err => {
    this.showSpinner=false;
  })
  }
  getDistributionList(){
    this.showSpinner=true;
    this._paymentViewService.getDistributorsList()
    .then((res:any)=>{
      this.showSpinner=false;
      if(res && res.length){
        this.distributorList = res;
        if(this.viewType == 'payment-invoice'){
          this.getPaymentDetails('invoices', this.requestId);
        }
        else if (this.viewType == 'order-invoice'){
          this.getOrderDetails(this.requestId)
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

}
