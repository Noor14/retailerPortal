import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { CreateMPINComponent } from './../create-mpin/create-mpin.component';
import { ResetMPINComponent } from './../reset-mpin/reset-mpin.component';
import { ChangeMPINComponent } from './../change-mpin/change-mpin.component';
import { SharedService } from 'src/app/services/shared.service';
import { LinkedAccountsComponent } from './../linked-accounts/linked-accounts.component';
import { AddAccountComponent } from './../add-account/add-account.component';
import { Router } from '@angular/router';
import { validateAllFormFields, loadingConfig } from './../../../constant/globalfunction';
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
  public newPasswordError: any;
  public updateBtnDisabled:boolean = true;
  private profileFormSubscriber:any;
  private passwordFormSubscriber:any;
  private newPasswordSubscriber:any;
  private confirmpasswordSubscriber:any;
//   @ViewChild('renderingContainer', { read: ViewContainerRef, static: false }) set content(container: ViewContainerRef) {
//     if (container) { // initially setter gets called with undefined
//         this.container = container;
//     }
//  }
  @ViewChild('renderingContainer', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  constructor(
    private _profileService: ProfileService,
    private _toast:ToastrService,
    private _userService: UserService,
    private _route :Router,
    private _sharedService: SharedService,
    private resolver: ComponentFactoryResolver
    ) { }

  canDeactivate(){
    if(!this.updateBtnDisabled || this.passwordForm.dirty){
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

    this._sharedService.renderComponent.subscribe(res => {
      if (res){
        this.renderingComponent(rendererType[res]);
      }
    })
 
  }
  renderingComponent(type) {
    this.container && this.container.clear(); 
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(type);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.type = type;
  }

  onTabChange(event){
    if(event.nextId == 'accountLinking'){
      setTimeout(()=>this.renderingComponent(LinkedAccountsComponent), 0)
    }
  }
  ngOnDestroy(){
      this.profileFormSubscriber && this.profileFormSubscriber.unsubscribe();
      this.passwordFormSubscriber && this.passwordFormSubscriber.unsubscribe();
      this.newPasswordSubscriber && this.newPasswordSubscriber.unsubscribe();
      this.confirmpasswordSubscriber && this.confirmpasswordSubscriber.unsubscribe();
      this.componentRef && this.componentRef.destroy();    
  }

  getProfile() {
    // this.showSpinner = true;
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
    if(this.passwordForm.valid && (this.passwordForm.controls['Password'].value != this.passwordForm.controls['NewPassword'].value) && (this.passwordForm.controls['NewPassword'].value == this.passwordForm.controls['ConfirmPassword'].value)){
    this.showSpinner = true;
    this._profileService.postCalls(this.passwordForm.value,8,"users/ChangePassword")
    .then((data:any)=>{
      if(data && (/true/i).test(data)){
        this.passwordForm.reset();
        this._toast.success("Your password has been updated. You would be logged out of your account");
        this.logout();
      }else{
        this.newPasswordError = data;
        if(this.passwordFormSubscriber){
          this.passwordFormSubscriber.unsubscribe();
        }
        this.onChangesAtnewPassChange();
        this.onChangesAtnewConfirmChange();
      }
      this.showSpinner = false;
    })
    .catch(err=>{
      this.showSpinner = false;
      if(err.error.status == 405){
        if(err.error.message === 'Incorrect Old Password'){
          this.oldPasswordError = true;
          this.onChangesAtPasswordChange();
        }
        // this._toast.error(err.error.message,"Error")
      }
    })
  } else if(this.passwordForm.valid){
    if(this.passwordForm.controls['NewPassword'].value != this.passwordForm.controls['ConfirmPassword'].value){
      this.newPasswordError = "Password mismatch";
      if(this.passwordFormSubscriber){
        this.passwordFormSubscriber.unsubscribe();
      }
    }else{
      this.newPasswordError = "New password cannot be similar to last 5 passwords";
      this.onChangesAtPasswordChange();
    }
    this.onChangesAtnewPassChange();
    this.onChangesAtnewConfirmChange();

  }
  else{
    validateAllFormFields(this.passwordForm);
    }
  }

  onChangesAtPasswordChange(){
    this.passwordFormSubscriber = this.passwordForm.get('Password').valueChanges.subscribe(val => {
         this.oldPasswordError = false;
         if(this.newPasswordError && this.newPasswordError != "Password mismatch"){
          this.newPasswordError = false;
         }
    });
  }
  onChangesAtnewPassChange(){
    this.newPasswordSubscriber = this.passwordForm.get('NewPassword').valueChanges.subscribe(val => {
         this.newPasswordError = false;
    });
  }
  onChangesAtnewConfirmChange(){
    this.confirmpasswordSubscriber = this.passwordForm.get('ConfirmPassword').valueChanges.subscribe(val => {
         this.newPasswordError = false;
    });
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
      if(err.error && err.error.status == 405){
        this._toast.error(err.error.message,"Error")
      }
    })
  }
  else{
    validateAllFormFields(this.profileForm);
  }
  }

}
export const rendererType = {
  changeMPIN : ChangeMPINComponent,
  resetMPIN : ResetMPINComponent,
  linkedAccounts : LinkedAccountsComponent,
  addAccount : AddAccountComponent,
  createMPIN: CreateMPINComponent
};
