import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eula',
  templateUrl: './eula.component.html',
  styleUrls: ['./eula.component.scss']
})
export class EULAComponent implements OnInit {

  userIdentity:any;

  constructor(private _loginService : LoginService,private _route:Router) { }
  // users/termsandcondition
  ngOnInit() {
    this.userIdentity= JSON.parse(sessionStorage.getItem('UserIdentity') );
  }

  AgreeTermsAndConditions(){
      var userObj={RetailerID:this.userIdentity.UserAccount.RetailerID};
      this._loginService.PostCalls(userObj,"users/termsandcondition",9)
      .then( data=>{
        if(data){
          this._route.navigate(['/updatePassword'])

        }
        else{

        }
      })
      .catch(err =>{

      });
  }
}
