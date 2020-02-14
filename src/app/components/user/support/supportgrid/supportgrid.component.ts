import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupportSignInService } from '../supportsign.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-supportgrid',
  templateUrl: './supportgrid.component.html',
  styleUrls: ['./supportgrid.component.scss']
})
export class SupportgridComponent implements OnInit, OnDestroy {

  private supportDropDownSubscriber:any;
  public lstSupport = [];
  public issueType: any[];
  searchObj: any = null;
  loadAvailable: boolean;
  constructor(private _supportService: SupportSignInService,
     private _sharedService: SharedService, private _router: Router) { }
  col = [
    { name: "Token ID", fieldName: "TicketNumber" },
    { name: "Issue Type", fieldName: "IssueType" },
    { name: "Created Date", fieldName: "CreatedDate" },
    { name: "Status", fieldName: "Status" },
    { name: "Actions", fieldName: "" },
  ]

  ngOnInit() {
    this.getLookups();
    this.search();
  }
  ngOnDestroy(){
    this.supportDropDownSubscriber.unsubscribe()
  }
  search() {
    if (this.searchObj == null) {
        this.searchObj = {};
        this.searchObj.TotalRecords = 10;
        this.searchObj.PageNumber = 0;
      }
      else {
        this.searchObj.TotalRecords = 10;
        this.searchObj.PageNumber++;
      }

      this._supportService.postCalls("support/Search", this.searchObj, 7)
        .then((data: any) => {

          this.lstSupport = [...this.lstSupport, ...data[0]];
          this.loadAvailable = (this.lstSupport.length == data[1].RecordCount)? false : true;
        })
        .catch(err => {
          console.log(err);
        })
  

  }
  getLookups() {
    this.supportDropDownSubscriber = this._sharedService.supportDropdownValues.subscribe((res:any)=>{
      if(res){
        this.issueType = res.ISSUE_TYPE_PRIVATE;
      }
    });
  }

  gotoView(id:Number){
    this._router.navigate(['/user/support/', id])
  }

}
