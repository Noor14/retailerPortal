
import { loadingConfig } from './../../../constant/globalfunction';
import { SharedService } from 'src/app/services/shared.service';
import { DialogComponent } from './../../../shared/dialog-modal/dialog/dialog.component';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentInstructionComponent } from '../../../shared/dialog-modal/payment-instruction/payment-instruction.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

  
  public payBygroupList: boolean = false;
  private searchObjPayment: any = {
    TotalRecords: 10,
    PageNumber : 0
  };
  private searchObjOrder: any = {
    TotalRecords: 10,
    PageNumber : 0
  };
  public filterObjOrder = {
    searchBy:[
      {name:'Order ID', placeholder: 'Order ID', type: 'typing', key: 'OrderNumber'},
      {name:'Company', placeholder: 'Company', type: 'typing', key: 'CompanyName'},
      {name:'Status', placeholder: 'Status', type: 'dropdown', key: 'Status', filterBy : undefined},
      {name:'Created Date', placeholder: ['From Date', 'To Date'], type: 'dateRange', key: ['DateFrom', 'DateTo']},
      {name:'Amount', placeholder: ['Min Amount', 'Max Amount'], type: 'range', key: ['AmountMin', 'AmountMax']}
     ],
    searchMode:'order',
    apiEndPoint:'Orders/Search',
    TotalRecords: 10,
    PageNumber : 0
   }
   public filterObjPayment = {
    searchBy:[
      {name:'Payment ID', placeholder: 'Payment ID', type: 'typing', key: 'InvoiceNumber'},
      {name:'Company', placeholder: 'Company', type: 'typing', key: 'CompanyName'},
      {name:'Status', placeholder: 'Status', type: 'dropdown', key: 'Status', filterBy : undefined},
      {name:'Paid Date', placeholder: ['From Date', 'To Date'], type: 'dateRange', key: ['DateFrom', 'DateTo']},
      {name:'Amount', placeholder: ['Min Amount', 'Max Amount'], type: 'range', key: ['PaymentAmountMin', 'PaymentAmountMax']}
     ],
     TotalRecords: 10,
     PageNumber : 0,
     apiEndPoint:'prepaidrequests/search',
     searchMode:'payment'
   }
  public showSpinner: boolean;
  public spinnerConfig:any;
  public loadAvailableCount:number; 
  public loadAvailableOrderCount:number; 
  public paymentsList: any[]= [];
  public orderList: any[]= [];
  private statusDropDownSubscriber: any;
  private searchingByKeyOrder:any;
  private searchingByKeyPayment:any;
  public lstPayAxis: any = {};
  public errorState:any;

  constructor(
    private _dashboardService: DashboardService,
    private _modalService: NgbModal,
    private _route: Router,
    private _sharedService: SharedService,
    private _activatedRoute:ActivatedRoute,
    private _toast: ToastrService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getdropDownList();
    this.getPaymentList(this.searchObjPayment);
    this.getOrderList(this.searchObjOrder);
  }
  ngOnDestroy(){
      this.statusDropDownSubscriber && this.statusDropDownSubscriber.unsubscribe();
  }
  viewDetail(type, id, status, payStatus){
    if(type == 'payment'){
      if(status && payStatus == 'Paid'){
        this._route.navigate(['/user/paymentView', id]);
      }else if(!status && payStatus == 'Paid'){
        this._route.navigate(['/user', 'invoiceView', id]);
      }
      else{
        this._route.navigate(['/user/payment-invoice', id]);
      }
    }else{
      if(status == 'Approved' && payStatus == 'Paid'){
        this._route.navigate(['/user', 'orderView', id]);
      }else{
        this._route.navigate(['/user/order-invoice', id]);
      }
    }
    
  }
  getdropDownList() {
    this.statusDropDownSubscriber = this._sharedService.dropDownValues.subscribe((res:any)=>{
      if(res && res.PREPAID_STATUS){
          let arr = res.PREPAID_STATUS.concat(res.INVOICE_STATUS);
          // filter unique value
           let statusesPayment = [...new Map(arr.map(item =>
            [item['value'], item])).values()];

          // set key name with the name of value
            statusesPayment = statusesPayment.filter((item:any) => item.value !='Pending' && item.value !='Delete' && item.value !='Partially Paid');
            statusesPayment.map((obj:any) => 
              {
                if(obj.value == 'Payment Processing'){
                  obj.value = 'Cancelled';
                  obj.key = 'Payment Processing';
                }else{
                  obj.key = obj.value;
                }
                return obj;
             });
            let objPayment = this.filterObjPayment.searchBy.find(obj => obj.key == 'Status');
            let ind = this.filterObjPayment.searchBy.findIndex(obj => obj.key == 'Status');
            objPayment.filterBy = statusesPayment;
            this.filterObjPayment.searchBy.splice(ind,1, objPayment);

            let obj = this.filterObjOrder.searchBy.find(obj => obj.key == 'Status');
            let index = this.filterObjOrder.searchBy.findIndex(obj => obj.key == 'Status');
            obj.filterBy = res.ORDER_STATUS;
            this.filterObjOrder.searchBy.splice(index,1, obj);
           
      }
    });
  }
  getPaymentList(searchObj){
    this.showSpinner=true;
    this._dashboardService.postCalls("prepaidrequests/search", searchObj)
    .then((data: any) => {
    this.showSpinner=false;
    if(!searchObj.PageNumber){
      this.paymentsList = data.PrePaidRequestData;
    }else{
      this.paymentsList = this.paymentsList.concat(data.PrePaidRequestData);
    }
    this.loadAvailableCount = data.RecordCount;
    })
    .catch(err => {
    this.showSpinner = false;
    })
  }

  getOrderList(searchObj){
    this.showSpinner=true;
    this._dashboardService.postCalls("Orders/Search", searchObj)
    .then((data: any) => {
    this.showSpinner=false;
    if(!searchObj.PageNumber){
      this.orderList = data[0];
    }else{
      this.orderList = this.orderList.concat(data[0]);
    }
    this.loadAvailableOrderCount = data[1].RecordCount;
    })
    .catch(err => {
    this.showSpinner = false;
    })
  }
  onTabChange(event){
      if(event.nextId == "order" && this.searchingByKeyOrder){
        this.getOrderList(this.searchObjOrder);
        this.searchingByKeyOrder = undefined;

      }
      else if(event.nextId == "payment" && this.searchingByKeyPayment){
        this.getPaymentList(this.searchObjPayment);
        this.searchingByKeyPayment = undefined;
      }
 
  }
  loadMore(mode){
    if(mode =='payment'){
      this.searchObjPayment.PageNumber++;
      let obj = {...this.searchObjPayment , ...this.searchingByKeyPayment};
      this.getPaymentList(obj);
    }else{
      this.searchObjOrder.PageNumber++
      let obj = {...this.searchObjOrder , ...this.searchingByKeyOrder};
      this.getOrderList(obj);
    }
  }
 
  onSearchResult(event){
    if(event.searchMode == "payment"){
      this.searchObjPayment.PageNumber = 0;
      this.paymentsList = event.data.PrePaidRequestData;
      let arr = Object.keys(event).filter(item => item != 'data' && item != 'searchMode');
      if(Array.isArray(arr) && arr.length){
        this.searchingByKeyPayment = {};
        for (const key in arr) {
          if (arr.hasOwnProperty(key)) {
            this.searchingByKeyPayment[arr[key]]= event[arr[key]];
          }
        }
      }else{
        this.searchingByKeyPayment =  null;
      }
      this.loadAvailableCount =  event.data.RecordCount;
    }else{
      this.searchObjOrder.PageNumber = 0;
      let arr= Object.keys(event).filter(item => item != 'data' && item != 'searchMode');
      if(Array.isArray(arr) && arr.length){
        this.searchingByKeyOrder = {};
        for (const key in arr) {
          if (arr.hasOwnProperty(key)) {
            this.searchingByKeyOrder[arr[key]]= event[arr[key]];
          }
        }
      }else{
        this.searchingByKeyOrder =  null;
      }
      this.orderList = event.data[0];
      this.loadAvailableOrderCount = event.data[1].RecordCount;
    }
  }
  openDialog(id :number, type, mode){
    const modalRef = this._modalService.open(DialogComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static'
     });
    let title = type.charAt(0).toUpperCase() + type.slice(1) + " " + mode.charAt(0).toUpperCase() + mode.slice(1);
    let btnText = (mode == 'order' && type == 'cancel')? title : type.charAt(0).toUpperCase() + type.slice(1);
    modalRef.componentInstance.obj = {id : id, title: title, titleTextColor: 'warning', mode: mode, type: type, btnText: btnText, detail: `Are you sure, you want to ${type} this ${mode}? `};
    modalRef.result.then((result) => {
      if(result){
        if(mode == 'payment' && type == 'delete'){
          let index = this.paymentsList.findIndex(obj => obj.RetailerInvoiceId == result)
          this.paymentsList.splice(index, 1);
          this.loadAvailableCount--
        }
       else if(mode == 'order'){
         if(type == 'delete'){
          let index = this.orderList.findIndex(obj => obj.ID == result)
          this.orderList.splice(index, 1);
          this.loadAvailableOrderCount--
         }else if(type == 'cancel'){
          let index = this.orderList.findIndex(obj => obj.ID == result)
          let obj = this.orderList.find(obj => obj.ID == result);
          obj.Status = "Cancelled"
          this.orderList.splice(index, 1, obj)
         }
        
       }
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDialogPSID(paymentPrepaidNumber, requestId){
    const modalRef = this._modalService.open(PaymentInstructionComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static',
      size:'lg'
     });
    let endPoint = "prepaidrequests/printRecipt";
    modalRef.componentInstance.obj = {PSID : paymentPrepaidNumber, VoucherNo: requestId, endPoint: endPoint};
    modalRef.result.then((result) => {
      if(result){
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }




  

  bankPayment(selectedItem,identifier): void {


   
   if(identifier == 1)
   {
    this._dashboardService.getJazzPaymentData('payaxis/PrePaidPay', selectedItem.InvoiceNumber).then((data: any) => {
      //this.showSpinner = false;
      this.lstPayAxis = data;
      console.log(data);
      setTimeout(() => {
        const frmPayment = <HTMLFormElement>document.getElementById('frmPayment');
        frmPayment.submit();
    }, 100);
      
    }).catch(err=>{
      //this.showSpinner=false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
   }

   //for invoice
   else
   {
    this._dashboardService.getJazzPaymentData('payaxis/InvoicePay', selectedItem.InvoiceNumber).then((data: any) => {
      //this.showSpinner = false;
      this.lstPayAxis = data;
      console.log(data);
      setTimeout(() => {
        const frmPayment = <HTMLFormElement>document.getElementById('frmPayment');
        frmPayment.submit();
    }, 100);
      
    }).catch(err=>{
      //this.showSpinner=false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
    
     
   }

}

payAxisMessage(): void {
  

  this._activatedRoute.queryParams.subscribe(params => {
    if (params['error'] != undefined) {
        this.errorState = params['error'];
        
    }
  
    if(this.errorState == 'true')
    {
      this._toast.error("Payment has not been paid.","Error")
    }
    else if(this.errorState == 'false')
    {
      this._toast.success("Payment has been sent successfully");
    }
    
  });

  const url: string = this._route.url.substring(0, this._route.url.indexOf('?'));
  this._route.navigateByUrl(url);
            
    }



}


