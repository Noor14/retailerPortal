import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AppPattern } from '../../../shared/app.mask';
import { ToastrService } from 'ngx-toastr';
import { validateAllFormFields } from 'src/app/constant/globalfunction';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent  implements OnInit {
  
  public forgetPasswordForm : FormGroup
  public errorToggle: boolean = false;

  constructor(private _loginService:LoginService, private _toast :ToastrService) { }

  ngOnInit(){
    this.forgetPasswordForm = new FormGroup({
    Email : new FormControl(null,[Validators.required,Validators.pattern(AppPattern.email_Pattern)])
  })
  }
  resetPassword(){
    if(this.forgetPasswordForm.valid){
    this._loginService.PostCalls(this.forgetPasswordForm.value,"retailer/CheckEmail", null)
    .then(data=>{
      if(data){
          this._toast.success("Test","Testing");
      }
      else{
        this.errorToggle=true;
      }
    })
   }
    else{
      validateAllFormFields(this.forgetPasswordForm);
    }
  }
}
