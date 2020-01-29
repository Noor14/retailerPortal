import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AppMasks, AppPattern } from '../../../shared/app.mask'
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registerForm: FormGroup;
  public cnicMask = AppMasks.cnic_Mask;
  public mobileMask = AppMasks.mobile_Mask;
  emailExist = false;
  UserExist = false;
  cnicExist = false;
  companyExist = false;
  mobileExist = false;

  constructor(
    private _toastr: ToastrService,
    private _loginService: LoginService,
    private _router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      ID: new FormControl(0, [Validators.required]),
      Name: new FormControl(null, [Validators.required]),
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      Password: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.password)]),
      ConfirmPassword: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.password)]),
      Username: new FormControl(null, [Validators.required]),
      CNIC: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      CompanyName: new FormControl(null, [Validators.required]),
      Address: new FormControl(null, [Validators.required])
    });
  }


  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.Password === this.registerForm.value.ConfirmPassword) {
        this._loginService.PostCalls(this.registerForm.value, "retailer/Register", null)
          .then((data: any) => {
            if (data.Found) {
              this.emailExist = data.Email;
              this.UserExist = data.Username;
              this.cnicExist = data.CNIC;
              this.mobileExist = data.Mobile;
              this.companyExist = data.Company;
            }
            else {
              this._toastr.success("ac", "acacacac");
              this._router.navigate(['/login'])
            }

          })
          .catch(err => {
            this._toastr.error("h", "h");
          })
      }
      else{
        this._toastr.error("password", "h");

      }
    }
  }
}
