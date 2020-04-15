import { CanComponentDeactivate } from './../../../services/deactivate.guard';
import { DialogComponent } from './../../../shared/dialog-modal/dialog/dialog.component';
import { validateAllFormFields, loadingConfig } from './../../../constant/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AppPattern } from '../../../shared/app.mask'
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.scss']
})
export class UpdatepasswordComponent implements OnInit, CanComponentDeactivate {
  public updatePasswordForm: FormGroup;
  public showSpinner: boolean;
  public spinnerConfig:any;
  public passToggle:boolean;
  public confirmPassToggle:boolean;
  private userIdentity:any;
  public passwordMisMatchError:boolean;
  private updatePasswordFormSubscriber:any;
  constructor(
    private _loginService: LoginService,
    private _route:Router,
    private _toast: ToastrService,
    private _modalService : NgbModal
    ) {

   }
  canDeactivate(){
    if(this.updatePasswordForm.dirty){
      let object = this.updatePasswordForm.value;
      if(Object.values(object).filter(item => item).length){
        return false;
      }else{
        return true;
      }
   
    }else{
      return true;
    }
  }
  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.userIdentity = (localStorage.getItem('userIdentity'))? JSON.parse(localStorage.getItem('userIdentity')) : undefined;
    let userName = (this.userIdentity && this.userIdentity.UserAccount)? this.userIdentity.UserAccount.Username : null;
    this.updatePasswordForm = new FormGroup({
      Username: new FormControl(userName, Validators.required),
      NewPassword: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.password)]),
      ConfirmPassword: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.password)]),
    })
  }
  ngOnDestroy(){
    if(this.updatePasswordFormSubscriber){
      this.updatePasswordFormSubscriber.unsubscribe();
    }
  }
  updatePassword() {
    if(this.updatePasswordForm.valid && this.updatePasswordForm.controls['ConfirmPassword'].value == this.updatePasswordForm.controls['NewPassword'].value){
      this.showSpinner = true;
    this._loginService.PostCalls(this.updatePasswordForm.value, "users/UpdatePassword", 8)
      .then(data => {
      this.showSpinner=false;
        if (data) {
          this._toast.success("Profile has been changed successfully");
          this.logout();
        }
        else{
          this._toast.success("Password not updated please try after some few minutes");
          this.userIdentity.UserAccount.IsTermAndConditionAccepted = 1;
          localStorage.setItem('userIdentity', JSON.stringify(this.userIdentity));
          this._route.navigate(['/user/dashboard']);
        }
      })
      .catch(err => {
        this.showSpinner=false;
      })
    }
    else if (this.updatePasswordForm.valid){
      this.passwordMisMatchError = true;
      this.onChanges()
    }
    else{
      validateAllFormFields(this.updatePasswordForm);
    }
  }

  onChanges():void{
    this.updatePasswordFormSubscriber = this.updatePasswordForm.valueChanges.subscribe(val => {
          this.passwordMisMatchError = false;
    });
  }
  openDialog(){
      const modalRef = this._modalService.open(DialogComponent, { 
        centered: true,
        keyboard: false,
        backdrop:'static'
      });
      modalRef.componentInstance.obj = {btnText: 'Skip', titleTextColor: 'warning', title: 'Skip Process', detail: 'Are you sure, you want to skip?', mode: 'confirmDialog'};
      modalRef.result.then((result) => {
        if(result){
          this.userIdentity.UserAccount.IsTermAndConditionAccepted = 1;
          localStorage.setItem('userIdentity', JSON.stringify(this.userIdentity));
          this._route.navigate(['/user/dashboard']);
        }
      },(reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }


  logout(){
    this._loginService.logoutUser()
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

}
