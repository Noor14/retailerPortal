import { Component, OnInit } from '@angular/core';
import { NetworkService } from './network.service';
import { loadingConfig } from 'src/app/constant/globalfunction';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  lstTotalNetwork = [ ];
  public showSpinner: boolean;
  public spinnerConfig: any;
  public searchObj: any = null;
  public loadAvailable: boolean;
  constructor(private _networkService: NetworkService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getNetwork();
  }

  getNetwork() {
    this.showSpinner=true;
    if (this.searchObj == null) {
        this.searchObj = {};
        this.searchObj.TotalRecords = 10;
        this.searchObj.PageNumber = 0;
      }
      else {
        this.searchObj.TotalRecords = 10;
        this.searchObj.PageNumber++;
      }

      this._networkService.postCalls("kyc/Search", this.searchObj, 7)
        .then((data: any) => {
          this.showSpinner=false;

          this.lstTotalNetwork = [...this.lstTotalNetwork, ...data[0]];
          this.loadAvailable = (this.lstTotalNetwork.length == data[1].kycRequestCount)? false : true;
        })
        .catch(err => {
          this.showSpinner=false;
          console.log(err);
        })
  

  }

}
