import { Router } from '@angular/router';
import { loadingConfig, validateAllFormFields } from './../../../constant/globalfunction';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProfileService } from './profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppPattern, AppMasks } from 'src/app/shared/app.mask';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import * as moment from 'moment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  private userObject: any;
  public cnicMask = AppMasks.cnic_Mask;
  public mobileMask = AppMasks.mobile_Mask;
  public spinnerConfig: any;
  public showSpinner:boolean;

  constructor(
    private _profileService: ProfileService,
    private _toast:ToastrService,
    private _userService: UserService,
    private _route :Router
    ) { }

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
      Address: new FormControl(null, [Validators.required]),
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

  getProfile() {
    this.showSpinner = true;
    this._profileService.getById(this.userObject.RetailerID, 1, "retailer")
      .then((data: any) => {
      this.showSpinner = false;
      data.CreatedDate =  moment(data.CreatedDate).format('DD-MM-YYYY');
        this.profileForm.patchValue(data)
      })
      .catch(err => {
      this.showSpinner = false;
        console.log(err);
      })
  }

  changePassword(){
    if(this.passwordForm.valid){
    this.showSpinner = true;
    this._profileService.postCalls(this.passwordForm.value,8,"users/ChangePassword")
    .then((data:any)=>{
      this._toast.success("Profile has been changed successfully");
      this.logout();

    })
    .catch(err=>{
      this.showSpinner = false;
      if(err.error.status==405){
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
      this._toast.success("Profile has been updated")

    })
    .catch(err=>{
      this.showSpinner = false;
      if(err.error.status==405){
        this._toast.error(err.error.message,"Error")
      }
    })
  }
  else{
    validateAllFormFields(this.profileForm);
  }
  }

}
