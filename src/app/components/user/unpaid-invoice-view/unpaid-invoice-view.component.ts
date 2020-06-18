import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { loadingConfig } from './../../../constant/globalfunction';
import { PaymentViewService } from './../payment-view/payment-view.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-unpaid-invoice-view',
  templateUrl: './unpaid-invoice-view.component.html',
  styleUrls: ['./unpaid-invoice-view.component.scss']
})
export class UnpaidInvoiceViewComponent implements OnInit {
  public distributorList:any[] = [];
  public requestId: number;
  public requestType: number = 0;
  public showSpinner: boolean;
  public spinnerConfig: any;
  public orderInfo: any;
  public orderDetailList: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _toast: ToastrService,
    private _paymentViewService: PaymentViewService
    ) {
      this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path);
     }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getDistributionList();
    
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
        this.getPaymentDetails('invoices', this.requestId);
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
