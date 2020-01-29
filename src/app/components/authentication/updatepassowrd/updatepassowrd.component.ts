import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AppMasks, AppPattern } from '../../../shared/app.mask'
import { Router } from '@angular/router';
@Component({
  selector: 'app-updatepassowrd',
  templateUrl: './updatepassowrd.component.html',
  styleUrls: ['./updatepassowrd.component.scss']
})
export class UpdatepassowrdComponent implements OnInit {
  public updatePasswordForm: FormGroup;
  userIdentity: any;

  constructor(private _loginService: LoginService,private _route:Router) {
    this.userIdentity= JSON.parse(sessionStorage.getItem('UserIdentity') );
   }

  ngOnInit() {
    this.updatePasswordForm = new FormGroup({
      Username: new FormControl(this.userIdentity.UserAccount.Username, []),
      NewPassword: new FormControl("", [Validators.required, Validators.pattern(AppPattern.password)]),
      ConfirmPassword: new FormControl("", [Validators.required, Validators.pattern(AppPattern.password)]),
    })
  }

  updatePassword() {
    this._loginService.PostCalls(this.updatePasswordForm.value, "users/UpdatePassword", 8)
      .then(data => {
        if (data) {
            this._route.navigate(['/login'])
        }
        else{
          this._route.navigate(['/user/dashboard']);
        }
      })
      .catch(err => {

      })
  }


}
