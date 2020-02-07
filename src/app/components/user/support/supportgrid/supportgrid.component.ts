import { Component, OnInit } from '@angular/core';
import { SupportSignInService } from '../supportsign.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supportgrid',
  templateUrl: './supportgrid.component.html',
  styleUrls: ['./supportgrid.component.scss']
})
export class SupportgridComponent implements OnInit {
  lstSupport=[];
  
  issueType: any[];
  criticality: any[];
  contacting: any[];
  searchObj:any=null;
  loadAvailable: boolean;
  constructor(private _supportService:SupportSignInService,private _route:Router) { }
  col=[
    {name:"Token ID",fieldName:"TicketNumber"},
    {name:"Issue Type",fieldName:"IssueType"},
    {name:"Created Date",fieldName:"CreatedDate"},
    {name:"Status",fieldName:"Status"},
    {name:"Actions",fieldName:""},
  ]

  ngOnInit() {
    this.getLookups();
    this.search();
  }
  search(){
 
    if(this.searchObj==null){
      this.searchObj = {};
      this.searchObj.TotalRecords =10;
      this.searchObj.PageNumber =0;
    }
    else{
      this.searchObj.TotalRecords =10;
      this.searchObj.PageNumber ++;
    }
    this._supportService.postCalls("support/Search",this.searchObj,7)
    .then((data:any)=>{
      this.lstSupport = [...this.lstSupport,...data[0]];
      console.log(data[1].RecordCount)
      if(this.lstSupport.length==data[1].RecordCount){
        this.loadAvailable = false
      }
      else{
        this.loadAvailable = true;
      }
    })
    .catch(err=>{
      console.log(err);
    })

  }
  getLookups(){
    this._supportService.getCalls('support/PrivateUsers',5)
    .then((data:any)=>{
      this.contacting=data[0];
      this.criticality=data[1];
      this.issueType=data[2];

    })
    .catch(err=>{

    })
  }
}
