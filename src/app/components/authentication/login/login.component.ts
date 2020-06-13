import { RoleAuthorizationService } from './../../../services/role-authorization.service';
import { SharedService } from './../../../services/shared.service';
import { validateAllFormFields, loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public showSpinner: boolean;
  public spinnerConfig: any;
  public loginForm : FormGroup
  public loginFailure: boolean = false;
  private loginFormSubscriber: any
  public passToggle:boolean;
  constructor(
    private _loginService: LoginService,
    private _sharedService: SharedService,
    private _roleAuthorizationService: RoleAuthorizationService,
    private _router: Router) {
  }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.loginForm = new FormGroup ({
      Username: new FormControl(null, Validators.required),
      Password: new FormControl(null, Validators.required),
      grant_type: new FormControl("password")
    });
  }

  ngOnDestroy(){
      this.loginFormSubscriber && this.loginFormSubscriber.unsubscribe();
  }

  onChanges():void{
    this.loginFormSubscriber = this.loginForm.valueChanges.subscribe(val => {
      if(val && Object.keys(val).length){
          this.loginFailure = false;
      }
    });
  }
  login() {
    if (this.loginForm.valid) {
      this.loginFailure = false;
      this.showSpinner = true;
      this._loginService.login(this.loginForm.value)
        .then((data:any) => {
          this.showSpinner = false;
          if (data.ErrorCode) {
            this.loginFailure = true;
            if(this.loginFormSubscriber){
              this.loginFormSubscriber.unsubscribe();
            }
            this.onChanges();
          }
          else {
            localStorage.setItem('userIdentity', JSON.stringify(data)); // can be used if you want to use session storage other chnge would be in Authentication Guard and home
            if (!data.UserAccount.IsTermAndConditionAccepted) {
              this._router.navigate(['eula']);
            }else if(data.UserAccount.IsTermAndConditionAccepted && !data.UserAccount.UpdatePassword){
              this._router.navigate(['updatePassword']);
            }
            else {
              this._router.navigate(['/user/dashboard']);
              this._sharedService.setUser(data.UserAccount);
              this._roleAuthorizationService.setUserRole(data.UserAccount.UserRights);

            }
          }
        })
        .catch(err => {
          this.showSpinner = false;
          console.log(err);
        })
    }else{
     this.loginFormSubscriber.unsubscribe();
      validateAllFormFields(this.loginForm);
    }

  }

}
