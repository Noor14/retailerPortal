import { loadingConfig, validateAllFormFields } from './../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AppPattern } from '../../../shared/app.mask'
import { Router } from '@angular/router';
@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.scss']
})
export class UpdatepasswordComponent implements OnInit {
  public updatePasswordForm: FormGroup;
  public showSpinner: boolean;
  public spinnerConfig: any;
  constructor(
    private _loginService: LoginService,
    private _route:Router,
    private _toast: ToastrService
    ) {

   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    let userObj = JSON.parse(localStorage.getItem('userIdentity'));
    this.updatePasswordForm = new FormGroup({
      Username: new FormControl(userObj.UserAccount.Username, Validators.required),
      NewPassword: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.password)]),
      ConfirmPassword: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.password)]),
    })
  }

  updatePassword() {
    if(this.updatePasswordForm.valid){
      this.showSpinner=true;
    this._loginService.PostCalls(this.updatePasswordForm.value, "users/UpdatePassword", 8)
      .then(data => {
      this.showSpinner=false;
        if (data) {
          this._toast.success("Password has been updated");
          this._route.navigate(['/login'])
        }
        else{
          this._toast.success("Password not updated please try after some few minutes");
          this._route.navigate(['/user/dashboard']);
        }
      })
      .catch(err => {
        this.showSpinner=false;
      })
    }
    else{
      validateAllFormFields(this.updatePasswordForm);
    }
  }


}
