import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { FormControl, Validators } from '@angular/forms';
import { AppPattern } from 'src/app/shared/app.mask';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgetpassowrd',
  templateUrl: './forgetpassowrd.component.html',
  styleUrls: ['./forgetpassowrd.component.scss']
})
export class ForgetpassowrdComponent  {
  Email = new FormControl("",[Validators.required,Validators.pattern(AppPattern.email_Pattern)])
  errorToggle:boolean;
  constructor(private _loginService:LoginService,private _toastr :ToastrService) { }

  resetPassword(){
    this._loginService.PostCalls({Email:this.Email.value},"retailer/CheckEmail",null)
    .then(data=>{
      if(data){
          this._toastr.success("Test","Testing");
      }
      else{
        this.errorToggle=true;
      }
    })
  }
}
