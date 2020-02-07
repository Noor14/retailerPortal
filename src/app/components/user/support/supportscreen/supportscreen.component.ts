import { Component, OnInit } from '@angular/core';
import { SupportSignInService } from '../supportsign.service';
import { Router } from '@angular/router';
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
  supportForm:FormGroup;
  public mobileMask = AppMasks.mobile_Mask;
  constructor(private _supportService:SupportSignInService,private _route:Router) { }

  ngOnInit() {
    this.getLookups();
    this.supportForm = new FormGroup({
      MobileNumber: new FormControl(JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount.RetailerMobile,[Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      Email: new FormControl(JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount.RetailerEmail, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      ContactName: new FormControl(JSON.parse(sessionStorage.getItem('userIdentity')).UserAccount.CompanyName, [Validators.required]),
      PreferredContactMethod: new FormControl('',[Validators.required]),
      Criticality: new FormControl('',[Validators.required]),
      IssueType: new FormControl('',[Validators.required]),
      Description: new FormControl('',[])
    });
  }
  getLookups(){
    this._supportService.getCalls('support/PrivateUsers',5)
    .then((data:any)=>{
      this.contacting=data[0];
      this.criticality=data[1];
      this.issueType=data[2];

    })
    .catch(err=>{

    })
  }
  save(){
    this._supportService.postCalls('support/PrivateSave',this.supportForm.value,8)
    .then((data:any)=>{
      console.log(data.TicketNumber);
      this._route.navigate(["/user/support"]);
    })
    .catch(err=>{

    })
  }
}
