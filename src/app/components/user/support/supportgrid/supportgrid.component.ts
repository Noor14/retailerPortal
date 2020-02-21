import { Component, OnInit, OnDestroy } from '@angular/core';
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

  private supportDropDownSubscriber:any;
  public lstSupport = [];
  public issueType: any[];
  searchObj: any = null;
  public loadAvailable: boolean;

  constructor(
    private _supportService: TicketSupportService,
    private _sharedService: SharedService,
    private _router: Router,
    private _modalService: NgbModal) { }

  ngOnInit() {
    this.getLookups();
    this.getSupportList();
  }
  ngOnDestroy(){
    this.supportDropDownSubscriber.unsubscribe()
  }
  getSupportList() {
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
  openDialog(id :Number){
    const modalRef = this._modalService.open(DialogComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static'
     });
    modalRef.componentInstance.obj = {id : id, title: 'Delete Ticket', detail:'Are you sure, you want to delete this ticket? '};
    modalRef.result.then((result) => {
      if(result){
        let index = this.lstSupport.findIndex(obj => obj.ID == result)
        this.lstSupport.splice(index, 1)
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
