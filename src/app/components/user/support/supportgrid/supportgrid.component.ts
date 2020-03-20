import { loadingConfig } from './../../../../constant/globalfunction';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { TicketSupportService } from '../ticket-support.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from 'src/app/shared/dialog-modal/dialog/dialog.component';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-supportgrid',
  templateUrl: './supportgrid.component.html',
  styleUrls: ['./supportgrid.component.scss']
})
export class SupportgridComponent implements OnInit, OnDestroy {

  @ViewChild('search', {static: false}) search: ElementRef;
  public showSpinner: boolean;
  public spinnerConfig: any;
  private supportDropDownSubscriber:any;
  public supportList:any[] = [];
  public issueType: any[];
  public loadAvailable: boolean;

  public searchObj: any = {
    TotalRecords: 10,
    PageNumber : 0,
    searchBy:[
      {name:'Token ID', placeholder: 'Token ID', type: 'typing', key: 'TicketNumber'},
      {name:'Status', placeholder: 'Status', type: 'dropdown', key: 'Status'},
      {name:'Created Date', placeholder: 'Created Date', type: 'dateRange', key: ['DateFrom', 'DateTo']},
      {name:'Issue Type', placeholder: 'Issue Type', type: 'dropdown', key: 'IssueType'}
     ],
    searchMode:'support'
  };
  constructor(
    private _supportService: TicketSupportService,
    private _sharedService: SharedService,
    private _router: Router,
    private _modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;

    this.getdropDownList();
    this.getSupportList(this.searchObj);
  }
  ngOnDestroy(){
    this.supportDropDownSubscriber.unsubscribe();
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
          this.loadAvailable = (this.supportList.length == data[1].RecordCount)? false : true;
        })
        .catch(err => {
          this.showSpinner=false;
          console.log(err);
        })
  }
  getdropDownList() {
    this.supportDropDownSubscriber = this._sharedService.dropDownValues.subscribe((res:any)=>{
      if(res){
        this.issueType = res.ISSUE_TYPE_PRIVATE;
      }
    });
  }

  gotoView(id:Number){
    this._router.navigate(['/user/support/', id])
  }
  loadMore(){
    this.searchObj.PageNumber++
    this.getSupportList(this.searchObj);
  }
  openDialog(id :Number){
    const modalRef = this._modalService.open(DialogComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static'
     });
    modalRef.componentInstance.obj = {id : id, title: 'Delete Ticket', deleteType: 'support', detail:'Are you sure, you want to delete this ticket? '};
    modalRef.result.then((result) => {
      if(result){
        let index = this.supportList.findIndex(obj => obj.ID == result)
        this.supportList.splice(index, 1)
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
