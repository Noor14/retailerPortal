import { loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig: any;
  public searchObj: any = {
    TotalRecords: 10,
    PageNumber : 0
  };
  public loadAvailable:boolean = true; 
  public paymentsList: any[]= [];
  constructor(private _dashboardService: DashboardService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getPaymentList();
  }

  getPaymentList(){
    this.showSpinner=true;
    this._dashboardService.postCalls("prepaidrequests/search", this.searchObj, 7)
    .then((data: any) => {
    this.showSpinner=false;

      if(data.PrePaidRequestCount){
        this.paymentsList = data.PrePaidRequestData;
        this.loadAvailable = (this.paymentsList.length == data.PrePaidRequestCount)? false : true;
      }
    })
    .catch(err => {
    this.showSpinner=false;
      console.log(err);
    })
  }

}
