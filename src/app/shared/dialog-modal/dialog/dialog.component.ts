import { HttpErrorResponse } from '@angular/common/http';
import { loadingConfig } from './../../../constant/globalfunction';
import { OrderDetailService } from './../../../components/user/order-detail/order-detail.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketSupportService } from './../../../components/user/support/ticket-support.service';
import { DashboardService } from '../../../components/user/dashboard/dashboard.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input() obj:any;
  public spinnerConfig:any;
  public showSpinner:boolean;
  public dialogBoxObject: any={};
  public name: string = undefined;
  constructor(
    public activeModal: NgbActiveModal,
    private _supportService: TicketSupportService,
    private _dashboardService :DashboardService,
    private _orderDetailService: OrderDetailService,
    private _toast: ToastrService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    if(this.obj && Object.keys(this.obj).length){
      this.dialogBoxObject = this.obj;
      if(this.dialogBoxObject.object && this.dialogBoxObject.object.Name){
        this.name = this.dialogBoxObject.object.Name;
      }
    }
  }


  performAction(){
    if(this.dialogBoxObject.mode == 'support'){
      this.showSpinner = true;
      this._supportService.postCalls('support/Delete', { ID: this.dialogBoxObject.id }, 7)
      .then((res: any) => {
        this._toast.success('Token successfully deleted');
        this.showSpinner = false;
        this.activeModal.close(this.dialogBoxObject.id);
      })
      .catch((err:HttpErrorResponse) => {
        this.showSpinner = false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }

      })
    }
    else if(this.dialogBoxObject.mode == 'payment'){
      this.showSpinner = true;
      this._dashboardService.deletePayment(this.dialogBoxObject.id)
      .then((res: any) => {
        this._toast.success('Payment successfully deleted');
        this.showSpinner = false;
        this.activeModal.close(this.dialogBoxObject.id);
      })
      .catch((err:HttpErrorResponse) => {
        this.showSpinner = false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
    }
    else if(this.dialogBoxObject.mode == 'confirmDialog'){
      this.showSpinner = true;
      if(this.dialogBoxObject.type != 'creationProcess'){
        this._toast.success('Product successfully deleted');
      }
      this.activeModal.close(true);
      this.showSpinner = false;
    }
    else if(this.dialogBoxObject.mode == 'order' && this.dialogBoxObject.type == 'delete'){
      this.showSpinner = true;
      this._dashboardService.deleteOrder(this.dialogBoxObject.id)
      .then((res: any) => {
        if(res && res.OrderId){
          this._toast.success('Order deleted');
          this.showSpinner = false;
          this.activeModal.close(this.dialogBoxObject.id);
        }
      })
      .catch((err:HttpErrorResponse) => {
        this.showSpinner = false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
    }
    else if(this.dialogBoxObject.mode == 'order' && this.dialogBoxObject.type == 'cancel'){
      this.showSpinner = true;
      let obj ={
        ID: this.dialogBoxObject.id,
        Status: 4
      }
      this._dashboardService.cancelOrder(obj)
      .then((res: any) => {
        if(res && res.ID){
          this._toast.success('Order canceled');
          this.showSpinner = false;
          this.activeModal.close(this.dialogBoxObject.id);
        }
        
      })
      .catch((err:HttpErrorResponse) => {
        this.showSpinner = false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
    }
    else if(this.dialogBoxObject.mode == 'orderTemplate'){
      if(this.name.trim()){
        this.showSpinner = true;
        this.dialogBoxObject.object.Name = this.name.trim();
        this._orderDetailService.save('ordertemplate/save', this.dialogBoxObject.object)
        .then((res: any) => {
          this.showSpinner = false;
          if(res.ID){
            this._toast.success('Template saved');
            let obj={
              id: res.ID,
              templateName: this.name.trim()
            }
            this.activeModal.close(obj);
          }
         
        })
        .catch((err:HttpErrorResponse) => {
          this.showSpinner = false;
          if(err.error){
            this._toast.error(err.error.message, "Error")
          }
        })
      }
   
    }
   
  }

}
