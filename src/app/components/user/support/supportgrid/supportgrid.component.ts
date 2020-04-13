import { loadingConfig } from './../../../../constant/globalfunction';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { TicketSupportService } from '../ticket-support.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from 'src/app/shared/dialog-modal/dialog/dialog.component';

@Component({
  selector: 'app-supportgrid',
  templateUrl: './supportgrid.component.html',
  styleUrls: ['./supportgrid.component.scss']
})
export class SupportgridComponent implements OnInit, OnDestroy {

  @ViewChild('search', {static: false}) search: ElementRef;
  public showSpinner: boolean;
  public spinnerConfig:any;
  private supportDropDownSubscriber:any;
  public supportList:any[] = [];
  public loadAvailableCount: number;

  private searchObj: any = {
    TotalRecords: 10,
    PageNumber : 0,
   
  };
  public filterObj = {
    searchBy:[
      {name:'Token ID', placeholder: 'Token ID', type: 'typing', key: 'TicketNumber'},
      {name:'Status', placeholder: 'Status', type: 'dropdown', key: 'Status', filterBy : undefined},
      {name:'Created Date', placeholder: ['From Date', 'To Date'], type: 'dateRange', key: ['DateFrom', 'DateTo']},
      {name:'Issue Type', placeholder: 'Issue Type', type: 'dropdown', key: 'IssueType', filterBy : undefined}
     ],
     TotalRecords: 10,
     PageNumber : 0,
     apiEndPoint:'support/Search',
     searchMode:'support'
   }
   private searchingByKey:any;

  constructor(
    private _supportService: TicketSupportService,
    private _sharedService: SharedService,
    private _router: Router,
    private _modalService: NgbModal) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getdropDownList();
    this.getSupportList(this.searchObj);
  }
  ngOnDestroy(){
    this.supportDropDownSubscriber.unsubscribe();
  }
  onSearchResult(event){
    this.supportList = event.data[0];
    this.searchObj.PageNumber = 0;
    let arr = Object.keys(event).filter(item => item != 'data' && item != 'searchMode');
    if(Array.isArray(arr) && arr.length){
      this.searchingByKey = {};
      for (const key in arr) {
        if (arr.hasOwnProperty(key)) {
          this.searchingByKey[arr[key]]= event[arr[key]];
        }
      }
    }else{
      this.searchingByKey =  null;
    }
    this.loadAvailableCount = event.data[1].RecordCount;
  }
 
  getSupportList(searchObj) {
    this.showSpinner=true;
      this._supportService.postCalls("support/Search", searchObj, 7)
        .then((data: any) => {
          this.showSpinner=false;
          if(!searchObj.PageNumber){
            this.supportList = data[0];
          }else{
            this.supportList = this.supportList.concat(data[0]);
          }
          this.loadAvailableCount = data[1].RecordCount;
        })
        .catch(err => {
          this.showSpinner=false;
          console.log(err);
        })
  }
  getdropDownList() {
    this.supportDropDownSubscriber = this._sharedService.dropDownValues.subscribe((res:any)=>{
      if(res){
        let objstatus = this.filterObj.searchBy.find(obj => obj.key == 'Status');
        let ind = this.filterObj.searchBy.findIndex(obj => obj.key == 'Status');
        objstatus.filterBy = res.SUPPORT_STATUS;
        this.filterObj.searchBy.splice(ind,1, objstatus);

        let objIssueType = this.filterObj.searchBy.find(obj => obj.key == 'IssueType');
        let index = this.filterObj.searchBy.findIndex(obj => obj.key == 'IssueType');
        objIssueType.filterBy = res.ISSUE_TYPE_PRIVATE;
        this.filterObj.searchBy.splice(index, 1, objIssueType);
      }
    });
  }

  loadMore(){
    this.searchObj.PageNumber++
    let obj = {...this.searchObj , ...this.searchingByKey};
    this.getSupportList(obj);
  }
  openDialog(id :Number){
    const modalRef = this._modalService.open(DialogComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static'
     });
    modalRef.componentInstance.obj = {id : id, title: 'Delete Ticket', titleTextColor: 'warning', mode: 'support', btnText: 'Yes, I want', detail:'Are you sure, you want to delete this ticket? '};
    modalRef.result.then((result) => {
      if(result){
        let index = this.supportList.findIndex(obj => obj.ID == result)
        this.supportList.splice(index, 1);
        this.loadAvailableCount--
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
