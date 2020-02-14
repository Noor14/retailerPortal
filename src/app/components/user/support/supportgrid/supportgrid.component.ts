import { Component, OnInit } from '@angular/core';
import { SupportSignInService } from '../supportsign.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-supportgrid',
  templateUrl: './supportgrid.component.html',
  styleUrls: ['./supportgrid.component.scss']
})
export class SupportgridComponent implements OnInit {
  lstSupport = [];
  issueType: any[];
  criticality: any[];
  contacting: any[];
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
    let data = this._sharedService.getDropDownValue();
    this.contacting = data["CONTACTING_METHOD"];
    this.criticality = data["CRITICALITY_PRIVATE"];
    this.issueType = data["ISSUE_TYPE_PRIVATE"];
  }

  gotoView(id:Number){
    this._router.navigate(['/user/support/', id])
  }

}
