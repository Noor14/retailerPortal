import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../login.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('longContent', { static: false }) longContent: ElementRef;
  loginForm : FormGroup
  userCredentials = { "grant_type": "password" };
  loginCredentials: any = {};
  loginFailure: boolean = false;
  constructor(private _loginService: LoginService, private _toast: ToastrService,
    private _router: Router) {
    this.logout();
  }

  ngOnInit() {
    this.loginForm = new FormGroup ({
      Username: new FormControl("",[Validators.required]),
      Password: new FormControl("",[Validators.required,Validators.minLength(6)]),
      grant_type: new FormControl("password")
    });
  }
  check(status) {
    if (status) {
      this._loginService.login(this.loginForm.value)
        .then(data => {
          this.loginCredentials = data;
          console.log(data);
          if (this.loginCredentials.ErrorCode) {
            this.loginFailure = true;
          }
          else {
            if (this.loginCredentials.UserAccount.IsTermAndConditionAccepted == 0) {
              sessionStorage.setItem('UserIdentity', JSON.stringify(this.loginCredentials)); // can be used if you want to use session storage other chnge would be in Authentication Guard and home
              localStorage.setItem('getSessionStorage', JSON.stringify(this.loginCredentials));
              this._router.navigate(['/eula'])
            }
            else {
              this._router.navigate(['/user/dashboard'])
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      this.loginFailure = true;

    }



  }
  logout() {
    sessionStorage.removeItem('UserIdentity');
    localStorage.removeItem('UserIdentity');
  }
}
