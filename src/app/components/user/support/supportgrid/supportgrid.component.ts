import { Component, OnInit } from '@angular/core';
import { SupportSignInService } from '../supportsign.service';
import { Router } from '@angular/router';

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
  constructor(private _supportService: SupportSignInService, private _route: Router) { }
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
        console.log(data[1].RecordCount)
        if (this.lstSupport.length == data[1].RecordCount) {
          this.loadAvailable = false
        }
        else {
          this.loadAvailable = true;
        }
      })
      .catch(err => {
        console.log(err);
      })

  }
  getLookups() {
    if (this._supportService.privateData == null) {
      this._supportService.getCalls('support/PrivateUsers', 5)
      .then((data: any) => {
        this.contacting = data["CONTACTING_METHOD"];
        this.criticality = data["CRITICALITY_PRIVATE"];
        this.issueType = data["ISSUE_TYPE_PRIVATE"];
        this._supportService.privateData =data;
      })
      .catch(err => {

      })
    }
    else{
      let data = this._supportService.privateData;
      this.contacting = data["CONTACTING_METHOD"];
      this.criticality = data["CRITICALITY_PRIVATE"];
      this.issueType = data["ISSUE_TYPE_PRIVATE"];
    }
  }
}
