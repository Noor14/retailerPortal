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
  public searchingOption:string = '';
  public searchBY: string[]= ['Token ID', 'Issue Type', 'Created Date', 'Status'];
  private searchObj: any = {
    TotalRecords: 10,
    PageNumber : 0,
    TicketNumber:null,
    DateFrom:null,
    DateTo:null,
    Status:null,
    IssueType:null
  };
  private modifySearchObj = Object.assign({}, this.searchObj);
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

  selectSearch(){
    if(this.searchingOption){
      this.changeDetectorRef.detectChanges();
      fromEvent(this.search.nativeElement, 'keyup').pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        // ,filter(res => res.length > 2)
        // Time in milliseconds between key events
        ,debounceTime(1000)        
        // If previous query is diffent from current   
        ,distinctUntilChanged()
        // subscription for response
        ).subscribe((text: string) => {
             if(text){
              this.modifySearchObj = Object.assign({}, this.searchObj);
              switch(this.searchingOption) {
                case 'Token ID':
                  this.modifySearchObj.TicketNumber = text
                  this.getSupportList(this.modifySearchObj);
                  break;
                
                case 'Issue Type':
                  this.modifySearchObj.IssueType = text
                  this.getSupportList(this.modifySearchObj);
                  break;

                case 'Status':
                  this.modifySearchObj.Status = text
                  this.getSupportList(this.modifySearchObj);
                  break;

                case 'Created Date':
                  this.modifySearchObj.CreatedDate = text
                  this.getSupportList(this.modifySearchObj);
                  break;

               
              }
             
             }
             else{
              this.getSupportList(this.searchObj);
              this.modifySearchObj = Object.assign({}, this.searchObj);
            }
          
        });
      }else{
        if(this.search.nativeElement && this.search.nativeElement.value){
          this.getSupportList(this.searchObj);
          this.modifySearchObj = Object.assign({}, this.searchObj);
        }
      }
  }
  
  filterByStatus(elem){
    if(this.searchingOption){
      if(elem.value){
        this.modifySearchObj = Object.assign({}, this.searchObj);
        if(this.searchingOption =='Issue Type'){
          this.modifySearchObj.IssueType = Number(elem.value)
        }else{
          this.modifySearchObj.Status = Number(elem.value)
        }
        this.getSupportList(this.modifySearchObj);
       }
       else{
        this.getSupportList(this.searchObj);
        this.modifySearchObj = Object.assign({}, this.searchObj);
      }
      }
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
    this.supportDropDownSubscriber = this._sharedService.supportDropdownValues.subscribe((res:any)=>{
      if(res){
        this.issueType = res.ISSUE_TYPE_PRIVATE;
      }
    });
  }

  gotoView(id:Number){
    this._router.navigate(['/user/support/', id])
  }
  loadMore(){
    this.modifySearchObj.PageNumber++
    this.getSupportList(this.modifySearchObj);
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
