import { CanComponentDeactivate } from './../../../services/deactivate.guard';
import { Router } from '@angular/router';
import { loadingConfig } from './../../../constant/globalfunction';
import { HttpErrorResponse } from '@angular/common/http';
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
export class ForgetpasswordComponent  implements OnInit, CanComponentDeactivate {
  public showSpinner: boolean;
  public spinnerConfig: any;
  public forgetPasswordForm : FormGroup
  public errorToggle: boolean = false;
  private forgetPasswordFormSubscriber: any;

  constructor(
    private _loginService:LoginService,
    private _toast :ToastrService,
    private _router: Router
     ) { }
  canDeactivate(){
      if(this.forgetPasswordForm.dirty){
        let object = this.forgetPasswordForm.value;
        if(Object.values(object).shift.length){
          return false;
        }else{
          return true;
        }
     
      }else{
        return true;
      }
    }
  ngOnInit(){
    this.spinnerConfig = loadingConfig;
    this.forgetPasswordForm = new FormGroup({
    Email : new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
    RedirectUrl : new FormControl(window.location.protocol + "//" + window.location.host + "/#/updatePassword", Validators.required)
  })
  }
  ngOnDestroy(){
    if(this.forgetPasswordFormSubscriber){
      this.forgetPasswordFormSubscriber.unsubscribe();
    }
  }
  onChanges():void{
    this.forgetPasswordFormSubscriber = this.forgetPasswordForm.valueChanges.subscribe(val => {
          this.errorToggle = false;
    });
  }
  resetPassword(){
    if(this.forgetPasswordForm.invalid){
      validateAllFormFields(this.forgetPasswordForm);
   }
    else{
      this.showSpinner = true;
      this._loginService.postCalls(this.forgetPasswordForm.value, "users/forgot", null)
      .then((data:string) =>{
      this.showSpinner = false;
        if(data && (/true/i).test(data)){
            this.forgetPasswordForm.reset();
            this._toast.success("Email sent");
            this._router.navigate(['login']);
        }
        else{
          this.errorToggle=true;
          if(this.forgetPasswordFormSubscriber){
            this.forgetPasswordFormSubscriber.unsubscribe();
          }
          this.onChanges();
        }
      }).catch((err:HttpErrorResponse) => {
        this.showSpinner = false;
        this._toast.error(err.error.message,"Error")
      })
    }
  }
}
