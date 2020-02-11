import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { SupportService } from './support.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  supportForm:FormGroup;
  issueType: any[];
  criticality: any[];
  contacting: any[];
  public mobileMask = AppMasks.mobile_Mask;
  constructor(private _supportService:SupportService,private _route:Router) { }

  ngOnInit() {
    this.supportForm = new FormGroup({
      MobileNumber: new FormControl('',[Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      ContactName: new FormControl(null, [Validators.required]),
      PreferredContactMethod: new FormControl('',[Validators.required]),
      Criticality: new FormControl('',[Validators.required]),
      IssueType: new FormControl('',[Validators.required]),
      Description: new FormControl('',[])
    });
    this.getLookups();
  }


  getLookups(){
    this._supportService.getCalls('support/PublicUsers')
    .then((data:any)=>{

      this.contacting=data[0];
      this.criticality=data[1];
      this.issueType=data[2];
    })
    .catch(err=>{

    })
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
