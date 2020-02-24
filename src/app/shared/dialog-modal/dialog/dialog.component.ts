import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketSupportService } from './../../../components/user/support/ticket-support.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input() obj:any;
  public dialogBoxObject: any={};

  constructor(
    public activeModal: NgbActiveModal,
    private _supportService: TicketSupportService,
    private _toast: ToastrService) { }

  ngOnInit() {
    if(this.obj && Object.keys(this.obj).length){
      this.dialogBoxObject = this.obj;
    }
  }


  delete(){
    this._supportService.postCalls('support/Delete', { ID: this.dialogBoxObject.id }, 7)
      .then((res: any) => {
        this._toast.success('Token successfully deleted')
        this.activeModal.close(this.dialogBoxObject.id);
      })
      .catch(err => {
      })
  }

}
