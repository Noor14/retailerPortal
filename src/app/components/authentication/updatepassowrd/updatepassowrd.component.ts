import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-updatepassowrd',
  templateUrl: './updatepassowrd.component.html',
  styleUrls: ['./updatepassowrd.component.scss']
})
export class UpdatepassowrdComponent implements OnInit {

  constructor(private _loginService:LoginService) { }

  ngOnInit() {
  }

  ChangePassword(){
    
  }


}
