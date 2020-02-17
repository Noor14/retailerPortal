import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

  public searchObj: any = {
    TotalRecords: 10,
    PageNumber : 0
  };
  public paymentsList: any[];
  constructor(private _dashboardService: DashboardService) { }

  ngOnInit() {
    this.getPaymentList();
  }

  getPaymentList(){
    this._dashboardService.postCalls("prepaidrequests/search", this.searchObj, 7)
    .then((data: any) => {
      if(data.PrePaidRequestCount){

      }

      this.paymentsList = data.PrePaidRequestData;
      console.log(this.paymentsList)
      // this.loadAvailable = (this.lstSupport.length == data[1].RecordCount)? false : true;
    })
    .catch(err => {
      console.log(err);
    })
  }

}
