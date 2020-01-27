import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eula',
  templateUrl: './eula.component.html',
  styleUrls: ['./eula.component.scss']
})
export class EULAComponent implements OnInit {

  constructor(private _loginService : LoginService,private _route:Router) { }
  // users/termsandcondition
  ngOnInit() {
  }

  AgreeTermsAndConditions(){
      var userObj={RetailerID:this._loginService.userIdentity.ID};
      this._loginService.PostCalls(userObj,"users/termsandcondition",9)
      .then( data=>{
        this._route.navigate(['/reset'])
      })
      .catch(err =>{

      });
  }
}
