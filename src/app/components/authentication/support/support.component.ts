import { Component, OnInit } from '@angular/core';
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
export class SupportComponent implements OnInit {
  supportForm: FormGroup;
  private issueType: any[];
  private criticality: any[];
  private contacting: any[];
  public mobileMask = AppMasks.mobile_Mask;
  constructor(private _supportService: SupportService, private _route: Router,private _sharedService : SharedService) { }

  ngOnInit() {
    this.supportForm = new FormGroup({
      MobileNumber: new FormControl('', [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      ContactName: new FormControl(null, [Validators.required]),
      PreferredContactMethod: new FormControl('', [Validators.required]),
      Criticality: new FormControl('', [Validators.required]),
      IssueType: new FormControl('', [Validators.required]),
      Description: new FormControl('', [])
    });
    this.getLookups();
  }


  getLookups() {
    let data =  this._sharedService.getDropDownValue();
    this.contacting = data["CONTACTING_METHOD"];
    this.criticality = data["CRITICALITY_PUBLIC"];
    this.issueType = data["ISSUE_TYPE_PUBLIC"];
    
  }
  save(){
    this._supportService.postCalls('support/PublicSave',this.supportForm.value)
    .then((data:any)=>{
      this._route.navigate(["/login"]);
    })
    .catch(err=>{

      })
  }
}
