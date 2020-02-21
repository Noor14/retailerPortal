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

  constructor(
    private _loginService: LoginService,
    private _route:Router,
    private _toast: ToastrService
    ) {

   }

  ngOnInit() {
    let userObj = JSON.parse(sessionStorage.getItem('UserIdentity'));
    this.updatePasswordForm = new FormGroup({
      Username: new FormControl(userObj.UserAccount.Username, [Validators.required]),
      NewPassword: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.password)]),
      ConfirmPassword: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.password)]),
    })
  }

  updatePassword() {
    if(this.updatePasswordForm.valid){
    this._loginService.PostCalls(this.updatePasswordForm.value, "users/UpdatePassword", 8)
      .then(data => {
        if (data) {
            this._route.navigate(['/login'])
        }
        else{
          this._toast.success("ac", "Password not updated please try after some few minutes");
          this._route.navigate(['/user/dashboard']);
        }
      })
      .catch(err => {

      })
    }
  }


}
