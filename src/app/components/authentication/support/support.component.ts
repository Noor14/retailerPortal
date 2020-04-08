import { CanComponentDeactivate } from '../../../services/deactivate.guard';
import { ToastrService } from 'ngx-toastr';
import { loadingConfig, validateAllFormFields } from './../../../constant/globalfunction';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { SupportService } from './support.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  private supportDropDownSubscriber:any;
  public supportForm: FormGroup;
  public issueType: any[] = [];
  public criticality: any[] = [];
  public contacting: any[] = [];
  public spinnerConfig:any;
  public showSpinner: boolean;
  public mobileMask = AppMasks.mobile_Mask;

  constructor(
    private _supportService: SupportService,
    private _router: Router,
    private _sharedService : SharedService,
    private _toast: ToastrService
    ) { }
  canDeactivate(){
      if(this.supportForm.dirty){
        let object = this.supportForm.value;
        if(Object.values(object).filter(item => item).length){
          return false;
        }else{
          return true;
        }
     
      }else{
        return true;
      }
    }
  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getdropDownList();
    this.supportForm = new FormGroup({
      MobileNumber: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      ContactName: new FormControl(null, Validators.required),
      PreferredContactMethod: new FormControl(null, Validators.required),
      Criticality: new FormControl(null, Validators.required),
      IssueType: new FormControl(null, Validators.required),
      Description: new FormControl(null)
    });
  }
  ngOnDestroy(){
    this.supportDropDownSubscriber.unsubscribe();
  }

  getdropDownList() {
    this.supportDropDownSubscriber = this._sharedService.dropDownValues.subscribe((res:any)=>{
      if(res){
        this.contacting = res.CONTACTING_METHOD;
        this.criticality = res.CRITICALITY_PUBLIC;
        this.issueType = res.ISSUE_TYPE_PUBLIC;
      }
    });
  }
  save(){
    if(this.supportForm.valid){
      this.showSpinner = true;
      this._supportService.postCalls('support/PublicSave',this.supportForm.value)
      .then((data:any)=>{
      this.showSpinner = false;
      if(data.ID){
        this._toast.success('Ticket successfully generated');
        this._router.navigate(["/login"]);
      }
      })
      .catch(err=>{
        this.showSpinner = false;
        })
    }
    else{
      validateAllFormFields(this.supportForm);
    }
    
  }
}
