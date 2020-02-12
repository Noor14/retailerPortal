import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SupportSignInService } from '../supportsign.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
@Component({
  selector: 'app-supportscreen',
  templateUrl: './supportscreen.component.html',
  styleUrls: ['./supportscreen.component.scss']
})
export class SupportscreenComponent implements OnInit {

  public supportDetail:any={};
  issueType: any[];
  criticality: any[];
  contacting: any[];
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
    private _route: ActivatedRoute) {

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
    this.supportForm = new FormGroup({
      ID: new FormControl(0),
      MobileNumber: new FormControl(userObj.RetailerMobile , [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      Email: new FormControl(userObj.RetailerEmail , [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      ContactName: new FormControl( userObj.CompanyName , [Validators.required]),
      PreferredContactMethod: new FormControl({value:null, disabled: this.readonlyCheck}, [Validators.required]),
      Criticality: new FormControl({value:null, disabled: this.readonlyCheck},  [Validators.required]),
      IssueType: new FormControl({value:null, disabled: this.readonlyCheck},  [Validators.required]),
      Description: new FormControl({value:null, disabled: this.readonlyCheck})
    });
  }

  getLookups() {
    if (this._supportService.privateData == null) {
      this._supportService.getCalls('support/PrivateUsers', 5)
      .then((data: any) => {
        this.contacting = data["CONTACTING_METHOD"];
        this.criticality = data["CRITICALITY_PRIVATE"];
        this.issueType = data["ISSUE_TYPE_PRIVATE"];
        this._supportService.privateData =data;
        if (this.supportID > 0)
          this.getByID(this.supportID);
      })
      .catch(err => {

      })
    }
    else{
      let data = this._supportService.privateData;
      this.contacting = data["CONTACTING_METHOD"];
      this.criticality = data["CRITICALITY_PRIVATE"];
      this.issueType = data["ISSUE_TYPE_PRIVATE"];
    }

  }
  save() {
    this._supportService.postCalls('support/PrivateSave', this.supportForm.value, 8)
      .then((data: any) => {
        console.log(data.TicketNumber);
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

  delete(){
    this._supportService.postCalls('support/Delete',{ID:this.supportForm.value.ID},7)
    .then(res=>{
      this._router.navigate(["/user/support"]);

    })
    .catch(err=>{

    })
  }
}
