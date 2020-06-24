import { loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit } from '@angular/core';
import { NetworkService } from './network.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  public lstTotalNetwork:any[] = [];
  public showSpinner: boolean;
  public spinnerConfig:any;
  public loadAvailable: boolean;
  private searchObj: any = {
	  KYCNumber : null,
    TotalRecords: 10,
    PageNumber : 0,
    CompanyName:null,
    DateFrom:null,
    DateTo:null,
    Status:null,
  };
  private modifySearchObj = Object.assign({}, this.searchObj);

  constructor(private _networkService: NetworkService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getNetwork(this.searchObj);
  }

  getNetwork(searchObj) {
    this.showSpinner=true;
      this._networkService.postCalls("kyc/Search", this.searchObj, 7)
        .then((data: any) => {
          this.showSpinner=false;
          if(!searchObj.PageNumber){
            this.lstTotalNetwork = data[0];
          }else{
            this.lstTotalNetwork = this.lstTotalNetwork.concat(data[0]);
          }
          this.loadAvailable = (this.lstTotalNetwork.length == data[1].kycRequestCount)? false : true;
        })
        .catch(err => {
          this.showSpinner=false;
          console.log(err);
        })
  

  }
  loadMore(){
    this.modifySearchObj.PageNumber++
    this.getNetwork(this.modifySearchObj);
  }

}
