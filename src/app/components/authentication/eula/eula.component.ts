import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eula',
  templateUrl: './eula.component.html',
  styleUrls: ['./eula.component.scss']
})
export class EULAComponent implements OnInit {

  private userIdentity:any;

  constructor(private _loginService : LoginService,private _route:Router) {
    this.userIdentity= JSON.parse(localStorage.getItem('userIdentity') );
    console.log(this.userIdentity);

   }
  // users/termsandcondition
  ngOnInit() {
  }

  agreeTermsAndConditions(){
      let userObj =
      { 
        RetailerID:this.userIdentity.UserAccount.RetailerID
      };
      this._loginService.PostCalls(userObj,"users/termsandcondition", 9)
      .then( data=>{
        if(data){
          if(this.userIdentity.UserAccount.SelfSignup){
            this._route.navigate((['/user/dashboard']))
          }
          else{
            this._route.navigate(['/updatePassword'])
          }

        }
       
      })
      .catch(err =>{

      });
  }
}
