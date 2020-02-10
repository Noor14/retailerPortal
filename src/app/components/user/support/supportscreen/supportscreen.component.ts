import { Component, OnInit } from '@angular/core';
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

  issueType: any[];
  criticality: any[];
  contacting: any[];
  supportForm: FormGroup;
  public mobileMask = AppMasks.mobile_Mask;
  supportID: number;
  breadcrumbSupport: string;
  Message: boolean = false;
  readonlyCheck: boolean = false
  constructor(private _supportService: SupportSignInService, private _router: Router,
    private _route: ActivatedRoute) {
    this._route.params.subscribe(params => {
      this.supportID = +params['id'];
      if (this.supportID == 0) {
        this.breadcrumbSupport = "Add Ticket";

      }
      else {
        this.breadcrumbSupport = "Edit Ticket";
        this.readonlyCheck = true;

      }
    });
  }

  ngOnInit() {
    this.getLookups();
    this.supportForm = new FormGroup({
      ID: new FormControl(0,[]),
      MobileNumber: new FormControl({
        value: JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount.RetailerMobile,
        disabled: this.readonlyCheck
      }, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),

      Email: new FormControl({
        value: JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount.RetailerEmail,
        disabled: this.readonlyCheck
      }, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),

      ContactName: new FormControl( JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount.CompanyName , [Validators.required]),
      PreferredContactMethod: new FormControl({value:"",disabled: this.readonlyCheck}, [Validators.required]),
      Criticality: new FormControl({value:"",disabled: this.readonlyCheck},  [Validators.required]),
      IssueType: new FormControl({value:"",disabled: this.readonlyCheck},  [Validators.required]),
      Description: new FormControl({value:"",disabled: this.readonlyCheck}, [])
    });
  }
  getLookups() {
    this._supportService.getCalls('support/PrivateUsers', 5)
      .then((data: any) => {
        this.contacting = data[0];
        this.criticality = data[1];
        this.issueType = data[2];
        if (this.supportID > 0)
          this.getByID(this.supportID);

      })
      .catch(err => {

      })
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
        console.log(data);

        this.supportForm.setValue({
          ID:data.ID,
          MobileNumber: data.MobileNumber,
          Email: data.Email,
          ContactName: data.Email,
          PreferredContactMethod: data.PreferredContactMethod,
          Criticality: data.Criticality,
          IssueType: data.IssueType,
          Description: data.Description
        })
        this.supportForm.addControl("TicketNumber",new FormControl(data.TicketNumber,[]));
        this.supportForm.addControl("Status",new FormControl(data.Status,[]));

      })
      .catch(err => {
        this.supportForm.reset();
        this.Message = true;
      })
  }

  Delete(){
    this._supportService.postCalls('support/Delete',{ID:this.supportForm.value.ID},7)
    .then(res=>{
      this._router.navigate(["/user/support"]);

    })
    .catch(err=>{

    })
  }
}
