import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { SupportService } from './support.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {
  private supportDropDownSubscriber:any;
  public supportForm: FormGroup;
  public issueType: any[];
  public criticality: any[];
  public contacting: any[];
  public mobileMask = AppMasks.mobile_Mask;

  constructor(
    private _supportService: SupportService,
    private _router: Router,
    private _sharedService : SharedService
    ) { }

  ngOnInit() {
    this.getLookups();
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
    this.supportDropDownSubscriber.unsubscribe()
  }

  getLookups() {
    this.supportDropDownSubscriber = this._sharedService.supportDropdownValues.subscribe((res:any)=>{
      if(res){
        this.contacting = res.CONTACTING_METHOD;
        this.criticality = res.CRITICALITY_PRIVATE;
        this.issueType = res.ISSUE_TYPE_PRIVATE;
      }
    });
  }
  save(){
    this._supportService.postCalls('support/PublicSave',this.supportForm.value)
    .then((data:any)=>{
      this._router.navigate(["/login"]);
    })
    .catch(err=>{

      })
  }
}
