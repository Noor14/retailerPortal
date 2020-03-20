import { DialogComponent } from './../../../shared/dialog-modal/dialog/dialog.component';
import { loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import {  NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

  public searchObjPayment: any = {
    TotalRecords: 10,
    PageNumber : 0,
    searchBy:[
      {name:'Payment ID', placeholder: 'Payment ID', type: 'typing', key: 'InvoiceNumber'},
      {name:'Company', placeholder: 'Company', type: 'typing', key: 'CompanyName'},
      {name:'Status', placeholder: 'Status', type: 'dropdown', key: 'Status'},
      {name:'Created Date', placeholder: 'Created Date', type: 'dateRange', key: ['DateFrom', 'DateTo']},
      {name:'Amount', placeholder: 'Amount', type: 'range', key: ['PaymentAmountMin', 'PaymentAmountMax']}
     ],
    searchMode:'payment'
  };
  public searchObjOrder: any = {
    TotalRecords: 10,
    PageNumber : 0,
    searchBy:[
      {name:'Order ID', placeholder: 'Order ID', type: 'typing', key: 'OrderNumber'},
      {name:'Company', placeholder: 'Company', type: 'typing', key: 'CompanyName'},
      {name:'Status', placeholder: 'Status', type: 'dropdown', key: 'Status'},
      {name:'Created Date', placeholder: 'Created Date', type: 'dateRange', key: ['DateFrom', 'DateTo']},
      {name:'Amount', placeholder: 'Amount', type: 'range', key: ['PaymentAmountMin', 'PaymentAmountMax']}
     ],
    searchMode:'order'
  };
  public showSpinner: boolean;
  public spinnerConfig: any;
 
  public loadAvailable:boolean = true; 
  public loadAvailableOrder:boolean = true; 
  public paymentsList: any[]= [];
  public orderList: any[]= [];
 

  constructor(
    private _dashboardService: DashboardService,
    private _modalService: NgbModal) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getPaymentList(this.searchObjPayment);
    this.getOrderList(this.searchObjOrder);
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
    this.loadAvailable = (this.paymentsList.length == data.RecordCount)? false : true;
    })
    .catch(err => {
    this.showSpinner=false;
      console.log(err);
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
    this.loadAvailableOrder = (this.orderList.length == data[1].RecordCount)? false : true;
    })
    .catch(err => {
    this.showSpinner=false;
      console.log(err);
    })
  }

  loadMore(mode){
    if(mode=='payment'){
      this.searchObjPayment.PageNumber++
      this.getPaymentList(this.searchObjPayment);
    }else{
      this.searchObjOrder.PageNumber++
      this.getOrderList(this.searchObjOrder);
    }
   
  }
 
  openDialog(id :Number){
    const modalRef = this._modalService.open(DialogComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static'
     });
    modalRef.componentInstance.obj = {id : id, title: 'Delete Payment', deleteType: 'payment', detail:'Are you sure, you want to delete this payment? '};
    modalRef.result.then((result) => {
      if(result){
        let index = this.paymentsList.findIndex(obj => obj.RetailerInvoiceId == result)
        this.paymentsList.splice(index, 1)
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
