import { loadingConfig, validateAllFormFields } from './../../../constant/globalfunction';
import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AppMasks, AppPattern } from '../../../shared/app.mask'
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public cnicMask = AppMasks.cnic_Mask;
  public mobileMask = AppMasks.mobile_Mask;
  public emailExist = false;
  public userExist = false;
  public cnicExist = false;
  public companyExist = false;
  public mobileExist = false;
  public spinnerConfig:any;
  public showSpinner: boolean;
  public passToggle:boolean;
  public confirmPassToggle:boolean;
  private registerFormMobileSubscriber:any;
  private registerFormCNICSubscriber:any;
  private registerFormUserNameSubscriber:any;
  private registerFormEmailSubscriber:any;
  private registerFormCompanyNameSubscriber:any;
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  // @ViewChild('langInput', { static: false }) langInput: ElementRef;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
 
  constructor(
    private _toast: ToastrService,
    private _loginService: LoginService,
    private _router: Router) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
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
      Address: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      recaptcha: new FormControl(null, [Validators.required])
    });
  }
  ngOnDestroy(){
    if(this.registerFormMobileSubscriber){
      this.registerFormMobileSubscriber.unsubscribe();
    }
    if(this.registerFormCNICSubscriber){
      this.registerFormCNICSubscriber.unsubscribe();
    }
    if(this.registerFormUserNameSubscriber){
      this.registerFormUserNameSubscriber.unsubscribe();
    }
    if(this.registerFormEmailSubscriber){
      this.registerFormEmailSubscriber.unsubscribe();
    }
    if(this.registerFormCompanyNameSubscriber){
      this.registerFormCompanyNameSubscriber.unsubscribe();
    }
  
  }
  onChanges(){
    if(this.registerFormMobileSubscriber){
      this.registerFormMobileSubscriber.unsubscribe();
    }
    if(this.registerFormCNICSubscriber){
      this.registerFormCNICSubscriber.unsubscribe();
    }
    if(this.registerFormUserNameSubscriber){
      this.registerFormUserNameSubscriber.unsubscribe();
    }
    if(this.registerFormEmailSubscriber){
      this.registerFormEmailSubscriber.unsubscribe();
    }
    if(this.registerFormCompanyNameSubscriber){
      this.registerFormCompanyNameSubscriber.unsubscribe();
    }
    if(this.emailExist){
      this.onEmailChanges();
    }
    if(this.userExist){
      this.onUserNameChanges();
    }
    if(this.cnicExist){
      this.onCnicChanges();
    }
    if(this.mobileExist){
      this.onMobileChanges();

    }
    if(this.companyExist){
      this.onCompanyChanges();

    }
  }
  onMobileChanges(){
    this.registerFormMobileSubscriber = this.registerForm.get('Mobile').valueChanges.subscribe(val => {
         if(this.mobileExist){
            this.mobileExist = false; 
          }
    });
  } 
  onCnicChanges(){
    this.registerFormCNICSubscriber = this.registerForm.get('CNIC').valueChanges.subscribe(val => {
         if(this.cnicExist){
            this.cnicExist = false; 
          }
    });
  } 
  onUserNameChanges(){
    this.registerFormUserNameSubscriber = this.registerForm.get('Username').valueChanges.subscribe(val => {
         if(this.userExist){
            this.userExist = false; 
          }
    });
  } 
  onEmailChanges(){
    this.registerFormEmailSubscriber = this.registerForm.get('Email').valueChanges.subscribe(val => {
         if(this.emailExist){
            this.emailExist = false; 
          }
    });
  }

  onCompanyChanges(){
    this.registerFormCompanyNameSubscriber = this.registerForm.get('CompanyName').valueChanges.subscribe(val => {
         if(this.companyExist){
            this.companyExist = false; 
          }
    });
  }



  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.Password === this.registerForm.value.ConfirmPassword) {
      this.showSpinner = true;
        this._loginService.PostCalls(this.registerForm.value, "retailer/Register", null)
          .then((data: any) => {
            this.showSpinner = false;
            if (data.Found) {
              this.emailExist = data.Email;
              this.userExist = data.Username;
              this.cnicExist = data.CNIC;
              this.mobileExist = data.Mobile;
              this.companyExist = data.Company;
              this.onChanges();
            }
            else {
              this._toast.success("Registered successfully");
              this._router.navigate(['/login'])
            }
          })
          .catch(err => {
            this.showSpinner = false;
            this._toast.error(err);
          })
      }
    }else{
      validateAllFormFields(this.registerForm);
    }
  }
}
