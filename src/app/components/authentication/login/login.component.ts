import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userCredentials = { "grant_type": "password"};
  loginCredentials :any={};
  loginFailure: boolean=false;
  constructor(private loginService :LoginService,private toast:ToastrService) { }

  ngOnInit() {
  }
    check(){
     this.loginService.login(this.userCredentials)
     .then( data=>{
      this.loginCredentials =data;
       console.log(data);
       if(this.loginCredentials.ErrorCode){
          this.loginFailure= true;
       }
     })
     .catch(err =>{
       console.log(err);
     })
  

    }
}
