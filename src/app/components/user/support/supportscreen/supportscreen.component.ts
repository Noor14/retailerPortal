import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SupportSignInService } from '../supportsign.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-supportscreen',
  templateUrl: './supportscreen.component.html',
  styleUrls: ['./supportscreen.component.scss']
})
export class SupportscreenComponent implements OnInit, OnDestroy {

  private supportDropDownSubscriber:any;
  public supportDetail: any = {};
  public issueType: any[];
  public criticality: any[];
  public contacting: any[];
  supportForm: FormGroup;
  public mobileMask = AppMasks.mobile_Mask;
  supportID: number;
  breadcrumbSupport: string;
  public message: boolean = false;
  readonlyCheck: boolean = false
  EmailEdit: boolean = true;
  mobileEdit: boolean = true;
  constructor(
    private _supportService: SupportSignInService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _sharedService: SharedService) {

    this._route.params.subscribe(params => {
      this.supportID = +params['id'];
      if (!this.supportID) {
        this.breadcrumbSupport = "Add Ticket";
        // this.EmailEdit = true
        // this.mobileEdit = true
      }
      else {
        this.breadcrumbSupport = "Edit Ticket";
        this.readonlyCheck = true;

      }
    });
  }

  ngOnInit() {
    let userObj = JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount

    this.getLookups();
    if (this.supportID>0) {
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
  save() {
    this._supportService.postCalls('support/PrivateSave', this.supportForm.value, 8)
      .then((data: any) => {
        this._router.navigate(["/user/support"]);
      })
      .catch(err => { 

      })
  }

  getByID(supportID) {
    this._supportService.getCalls('support/TicketById/' + supportID, 5)
      .then((data: any) => {
        this.supportDetail = data;
        this.supportForm.patchValue(this.supportDetail);
      })
      .catch(err => {
        this.supportForm.reset();
        this.message = true;
      })
  }

  delete() {
    this._supportService.postCalls('support/Delete', { ID: this.supportForm.value.ID }, 7)
      .then((res: any) => {
        this._router.navigate(["/user/support"]);
      })
      .catch(err => {

      })
  }
}
