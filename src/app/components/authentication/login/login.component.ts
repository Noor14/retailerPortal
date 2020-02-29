import { SharedService } from './../../../services/shared.service';
import { loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig: any;
  public loginForm : FormGroup
  public loginFailure: boolean = false;
  constructor(
    private _loginService: LoginService,
    private _sharedService: SharedService,
    private _router: Router) {
  }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    
    this.loginForm = new FormGroup ({
      Username: new FormControl(null, [Validators.required]),
      Password: new FormControl(null, [Validators.required]),
      grant_type: new FormControl("password")
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.showSpinner = true;
      this._loginService.login(this.loginForm.value)
        .then((data:any) => {
          this.showSpinner = false;
          if (data.ErrorCode) {
            this.loginFailure = true;
          }
          else {
            localStorage.setItem('userIdentity', JSON.stringify(data)); // can be used if you want to use session storage other chnge would be in Authentication Guard and home
            if (!data.UserAccount.IsTermAndConditionAccepted) {
              this._router.navigate(['/eula']);
              
            }
            else {
              this._router.navigate(['/user/dashboard']);
              this._sharedService.setUser(data.UserAccount);

            }
          }
        })
        .catch(err => {
          this.showSpinner = false;
          console.log(err);
        })
    }

  }

}
