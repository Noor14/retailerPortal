import { HttpErrorResponse } from '@angular/common/http';
import { loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eula',
  templateUrl: './eula.component.html',
  styleUrls: ['./eula.component.scss']
})
export class EULAComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig: any;
  private userIdentity:any;

  constructor(private _loginService : LoginService,private _route:Router) {
  }
  // users/termsandcondition
  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.userIdentity = (localStorage.getItem('userIdentity'))? JSON.parse(localStorage.getItem('userIdentity')) : undefined;
  }
  disagree(){
    if(localStorage.getItem('userIdentity')){
      this.logout();
    } 
    this._route.navigate(["login"]);
  }

  logout(){
    this._loginService.logoutUser()
    .then((res:boolean)=>{
        localStorage.clear();
    })
    .catch((err:HttpErrorResponse)=>{
      localStorage.clear();
      })
  }
  agreeTermsAndConditions(){
    this.showSpinner = true;
      let userObj = { 
        RetailerID: this.userIdentity && this.userIdentity.UserAccount && this.userIdentity.UserAccount.RetailerID
      };
      this._loginService.postCalls(userObj,"users/termsandcondition", 9)
      .then( data=>{
        if(data){
          this.showSpinner = false;
          if(this.userIdentity.UserAccount.SelfSignUp){
            this.userIdentity.UserAccount.IsTermAndConditionAccepted = 1;
            localStorage.setItem('userIdentity', JSON.stringify(this.userIdentity));
            this._route.navigate((['/user/dashboard']))
          }
          else{
            this.userIdentity.UserAccount.IsTermAndConditionAccepted = 1;
            this._route.navigate(['/updatePassword'])
          }

        }
       
      })
      .catch((err:HttpErrorResponse) =>{
        this.showSpinner = false;
      });
  }
}
