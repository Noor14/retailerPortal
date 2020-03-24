import { SharedService } from 'src/app/services/shared.service';
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
      {name:'Created Date', placeholder: 'Created Date', type: 'dateRange', key: ['DateFrom', 'DateTo']},
      {name:'Amount', placeholder: 'Amount', type: 'range', key: ['PaymentAmountMin', 'PaymentAmountMax']}
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
      {name:'Amount', placeholder: 'Amount', type: 'range', key: ['PaymentAmountMin', 'PaymentAmountMax']}
     ],
     TotalRecords: 10,
     PageNumber : 0,
     apiEndPoint:'prepaidrequests/search',
     searchMode:'payment'
   }
  public showSpinner: boolean;
  public spinnerConfig: any;
 
  public loadAvailable:boolean = true; 
  public loadAvailableOrder:boolean = true; 
  public paymentsList: any[]= [];
  public orderList: any[]= [];
  private statusDropDownSubscriber: any;
  private searchingByKey:any;

  constructor(
    private _dashboardService: DashboardService,
    private _modalService: NgbModal,
    private _sharedService: SharedService) { }

  ngOnInit() {
    this.getdropDownList();
    this.spinnerConfig = loadingConfig;
    this.getPaymentList(this.searchObjPayment);
    this.getOrderList(this.searchObjOrder);
  }
  ngOnDestroy(){
    if(this.statusDropDownSubscriber){
      this.statusDropDownSubscriber.unsubscribe();
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
            statusesPayment.map((obj:any) => {obj.key = obj.value});
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
    if(mode =='payment'){
      this.searchObjPayment.PageNumber++;
      let obj = {...this.searchObjPayment , ...this.searchingByKey};
      this.getPaymentList(obj);
    }else{
      this.searchObjOrder.PageNumber++
      let obj = {...this.searchObjOrder , ...this.searchingByKey};
      this.getOrderList(obj);
    }
  }
 
  onSearchResult(event){
    if(event.searchMode == "payment"){
      this.searchObjPayment.PageNumber = 0;
      this.paymentsList = event.data.PrePaidRequestData;
      let key= Object.keys(event).filter(item => item != 'data' && item != 'searchMode').pop();
      if(key){
        this.searchingByKey = {[key]: event[key]}
      }
      this.loadAvailable = (this.paymentsList.length == event.data.RecordCount)? false : true;
    }else{
      this.searchObjOrder.PageNumber = 0;
      let key= Object.keys(event).filter(item => item != 'data' && item != 'searchMode').pop();
      if(key){
        this.searchingByKey = {[key]: event[key]}
      }
      this.orderList = event.data[0];
      this.loadAvailableOrder = (this.orderList.length == event.data[1].RecordCount)? false : true;
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
