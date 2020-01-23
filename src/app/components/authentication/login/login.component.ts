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
    login(){
     this.loginService.login(this.userCredentials)
     .then( (data:any)=>{
      if(data.ErrorCode){
        this.loginFailure= true;
      }else{
        this.loginCredentials =data;
      }
     })
     .catch(err =>{
       console.log(err);
     })
  

    }
}
