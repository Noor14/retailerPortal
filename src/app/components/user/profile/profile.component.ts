import { Router } from '@angular/router';
import { validateAllFormFields, loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ProfileService } from './profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from '../../../shared/app.mask';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import * as moment from 'moment';
import { CanComponentDeactivate } from '../../../services/deactivate.guard';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  private userObject: any;
  public cnicMask = AppMasks.cnic_Mask;
  public mobileMask = AppMasks.mobile_Mask;
  public showSpinner:boolean;
  public spinnerConfig:any;
  public passToggle:boolean;
  public newToggle:boolean;
  public confirmToggle:boolean;
  public oldPasswordError: boolean;
  public updateBtnDisabled:boolean = true;
  private profileFormSubscriber:any;
  constructor(
    private _profileService: ProfileService,
    private _toast:ToastrService,
    private _userService: UserService,
    private _route :Router
    ) { }

  canDeactivate(){
    if(!this.updateBtnDisabled){
      return false
    }else{
      return true
    }
  }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.userObject = JSON.parse(localStorage.getItem('userIdentity')).UserAccount;
    this.profileForm = new FormGroup({
      ID: new FormControl(null, [Validators.required, Validators.min(0)]),
      Name: new FormControl(null, [Validators.required]),
      RetailerCode: new FormControl({value:null, disabled:true}, [Validators.required]),
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      CNIC: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      Address: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      CreatedDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      CompanyName: new FormControl(null, [Validators.required]),
      
    });
     
      this.passwordForm = new FormGroup ({
        Username: new FormControl(this.userObject.Username,[Validators.required]),
        Password: new FormControl(null,[Validators.required,Validators.pattern(AppPattern.password)]),
        NewPassword: new FormControl(null,[Validators.required,Validators.pattern(AppPattern.password)]),
        ConfirmPassword: new FormControl(null,[Validators.required,Validators.pattern(AppPattern.password)])
      })
    this.getProfile();
  }

  ngOnDestroy(){
    if(this.profileFormSubscriber){
      this.profileFormSubscriber.unsubscribe();
    }
  }

  getProfile() {
    this.showSpinner = true;
    this._profileService.getById(this.userObject.RetailerID, 1, "retailer")
      .then((data: any) => {
      this.showSpinner = false;
      data.CreatedDate =  moment(data.CreatedDate).format('DD-MM-YYYY');
        this.profileForm.patchValue(data);
        this.onChanges();
      })
      .catch(err => {
      this.showSpinner = false;
        console.log(err);
      })
  }
  onChanges():void{
    this.profileFormSubscriber = this.profileForm.valueChanges.subscribe(val => {
      if(val && Object.keys(val).length){
          this.updateBtnDisabled = false;
      }
    });
  }
  elemFocus(elem){
    elem.readOnly= false;
    elem.focus()
  }
  elemFocusOut(elem){
    elem.readOnly= true;
  }
  changePassword(){
    if(this.passwordForm.valid){
    this.showSpinner = true;
    this._profileService.postCalls(this.passwordForm.value,8,"users/ChangePassword")
    .then((data:any)=>{
      this._toast.success("Your password has been updated. You would be logged out of your account");
      this.logout();

    })
    .catch(err=>{
      this.showSpinner = false;
      if(err.error.status==405){
        if(err.error.message === 'Incorrect Old Password'){
          this.oldPasswordError = true;
        }
        this._toast.error(err.error.message,"Error")
      }
    })
  }
  else{
    validateAllFormFields(this.passwordForm);
  }
  }
  logout(){
    this._userService.logoutUser()
    .then((res:boolean)=>{
      if(res){
        localStorage.clear();
        this._route.navigate(['/login'])
      }    
      this.showSpinner=false;
    })
    .catch(err=>{
    this.showSpinner=false;

      })
  }

  updateProfile(){
    if(this.profileForm.valid){
    this.showSpinner = true;
    this._profileService.postCalls(this.profileForm.value, 8 ,"retailer/Save")
    .then((data:any)=>{
      this.showSpinner = false;
      if(data.ID){
        this.updateBtnDisabled = true;
        this._toast.success("Profile updated")
      }
    })
    .catch(err=>{
      this.showSpinner = false;
      if(err.error && err.error.status==405){
        this._toast.error(err.error.message,"Error")
      }
    })
  }
  else{
    validateAllFormFields(this.profileForm);
  }
  }

}
