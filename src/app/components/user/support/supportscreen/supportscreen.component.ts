import { CanComponentDeactivate } from './../../../../services/deactivate.guard';
import { validateAllFormFields, loadingConfig } from './../../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { SharedService } from '../../../../services/shared.service';
import { SupportService } from '../support.service';
@Component({
  selector: 'app-supportscreen',
  templateUrl: './supportscreen.component.html',
  styleUrls: ['./supportscreen.component.scss']
})
export class SupportscreenComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  public showSpinner: boolean;
  public spinnerConfig:any;
  private supportDropDownSubscriber:any;
  public supportDetail: any = {};
  public issueType: any[] = [];
  public criticality: any[] = [];
  public contacting: any[] = [];
  public supportForm: FormGroup;
  public mobileMask = AppMasks.mobile_Mask;
  private supportID: number;
  public breadcrumbSupport: string;
  private readonlyCheck: boolean = false
  public emailEdit: boolean = true;
  constructor(
    private _supportService: SupportService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _toast : ToastrService) {
      this.supportID = this._route.snapshot.url[1] && Number(this._route.snapshot.url[1].path)
      if (!this.supportID) {
        this.breadcrumbSupport = "Add Ticket";
      }
      else {
        this.breadcrumbSupport = "Edit Ticket";
        this.readonlyCheck = true;

      }
  }
  canDeactivate(){
    if(this.supportForm.dirty){
        return false;
   
    }else{
      return true;
    }
  }
  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getdropDownList();
    let userObj = JSON.parse(localStorage.getItem('userIdentity')).UserAccount
    if (this.supportID) {
      this.getByID(this.supportID);
    }

    this.supportForm = new FormGroup({
      ID: new FormControl(0),
      MobileNumber: new FormControl(userObj.RetailerMobile, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      Email: new FormControl(userObj.RetailerEmail, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      ContactName: new FormControl(userObj.CompanyName, [Validators.required]),
      PreferredContactMethod: new FormControl({ value: null, disabled: this.readonlyCheck }, [Validators.required]),
      Criticality: new FormControl({ value: null, disabled: this.readonlyCheck }, [Validators.required]),
      IssueType: new FormControl({ value: null, disabled: this.readonlyCheck }, [Validators.required]),
      Description: new FormControl({ value: null, disabled: this.readonlyCheck })
    });
  }
  ngOnDestroy(){
    this.supportDropDownSubscriber.unsubscribe();
  }
  elemFocus(elem){
    elem.readOnly= false;
    elem.focus()
  }
  elemFocusOut(elem){
    elem.readOnly= true;
  }
  getdropDownList() {
    this.supportDropDownSubscriber = this._sharedService.dropDownValues.subscribe((res:any)=>{
      if(res){
        this.contacting = res.CONTACTING_METHOD;
        this.criticality = res.CRITICALITY_PRIVATE;
        this.issueType = res.ISSUE_TYPE_PRIVATE;
      }
    });
  }
  save() {
    if(this.supportForm.valid){
      this.showSpinner=true;
      this._supportService.postCalls('support/PrivateSave', this.supportForm.value, 8)
        .then((data: any) => {
           this.showSpinner=false;
  
          if(data.ID){
            this.supportForm.reset();
            this._toast.success('Ticket created');
            this._router.navigate(["/user/support"]);
          }
  
        })
        .catch(err => { 
          this.showSpinner=false;
  
        })
    }
    else{
      validateAllFormFields(this.supportForm);
    }
 
  }

  getByID(supportID) {
    this.showSpinner=true;
    this._supportService.getCalls('support/TicketById/' + supportID, 5)
      .then((data: any) => {
        this.showSpinner=false;
        this.supportDetail = data;
        this.supportForm.patchValue(this.supportDetail);
      })
      .catch(err => {
        this.showSpinner=false;
        this.supportForm.reset();
      })
  }

  delete() {
    this.showSpinner=true;
    this._supportService.postCalls('support/Delete', { ID: this.supportForm.value.ID }, 7)
      .then((res: any) => {
        this.showSpinner=false;
        this._toast.success('Ticket deleted')
        this._router.navigate(["/user/support"]);
      })
      .catch(err => {
        this.showSpinner=false;

      })
  }
}
