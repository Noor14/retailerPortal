import { loadingConfig } from './../../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { SharedService } from '../../../../services/shared.service';
import { TicketSupportService } from '../ticket-support.service';
@Component({
  selector: 'app-supportscreen',
  templateUrl: './supportscreen.component.html',
  styleUrls: ['./supportscreen.component.scss']
})
export class SupportscreenComponent implements OnInit, OnDestroy {
  public showSpinner: boolean;
  public spinnerConfig: any;
  private supportDropDownSubscriber:any;
  private routeSubscriber: any
  public supportDetail: any = {};
  public issueType: any[];
  public criticality: any[];
  public contacting: any[];
  public supportForm: FormGroup;
  public mobileMask = AppMasks.mobile_Mask;
  private supportID: number;
  public breadcrumbSupport: string;
  public message: boolean = false;
  private readonlyCheck: boolean = false
  public emailEdit: boolean = true;
  public mobileEdit: boolean = true;
  constructor(
    private _supportService: TicketSupportService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _toast : ToastrService) {

   this.routeSubscriber= this._route.params.subscribe(params => {
      this.supportID = +params['id'];
      if (!this.supportID) {
        this.breadcrumbSupport = "Add Ticket";
      }
      else {
        this.breadcrumbSupport = "Edit Ticket";
        this.readonlyCheck = true;

      }
    });
  }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getdropDownList();
    let userObj = JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount
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
    this.routeSubscriber.unsubscribe();
  }

  getdropDownList() {
    this.supportDropDownSubscriber = this._sharedService.supportDropdownValues.subscribe((res:any)=>{
      if(res){
        this.contacting = res.CONTACTING_METHOD;
        this.criticality = res.CRITICALITY_PRIVATE;
        this.issueType = res.ISSUE_TYPE_PRIVATE;
      }
    });
  }
  save() {
    this.showSpinner=true;
    this._supportService.postCalls('support/PrivateSave', this.supportForm.value, 8)
      .then((data: any) => {
         this.showSpinner=false;

        if(data.ID){
          this._toast.success('Ticket successfully generated');
          this._router.navigate(["/user/support"]);

        }

      })
      .catch(err => { 
        this.showSpinner=false;

      })
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
        this.message = true;
      })
  }

  delete() {
    this.showSpinner=true;
    this._supportService.postCalls('support/Delete', { ID: this.supportForm.value.ID }, 7)
      .then((res: any) => {
        this.showSpinner=false;
        this._toast.success('Token successfully deleted')
        this._router.navigate(["/user/support"]);
      })
      .catch(err => {
        this.showSpinner=false;

      })
  }
}
