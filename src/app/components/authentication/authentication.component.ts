import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SupportService } from './support/support.service';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  public signupBtnToggle: boolean = true;
  public supportBtnToggle: boolean = true;
  private btnTogglingSubscription: any;
  constructor(
    private _sharedService: SharedService,
    private _route:Router,
    private _loginService: LoginService,
    private _supportService: SupportService) { }

  ngOnInit() {
    this.btnTogglingSubscription = this._sharedService.btnToggling.subscribe((res)=>{
      if(res){
        this.signupBtnToggle = (res =='/registration')? false : true;
        this.supportBtnToggle = (res =='/support')? false : true;
      }
    })
    this._supportService.getCalls("support/PublicUsers")
    .then((data:any)=>{
      if(data && Object.keys(data).length){
        this._sharedService.dropDownValues.next(data);
      }
    })
  }
  ngOnDestroy(){
    this.btnTogglingSubscription.unsubscribe();
  }
  navigate(route){
    if(localStorage.getItem('userIdentity')){
      this.logout();
    } 
    this._route.navigate([route]);
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
}
