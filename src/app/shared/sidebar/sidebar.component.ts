import { loadingConfig } from './../../constant/globalfunction';
import { UserService } from './../../components/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private _userService : UserService, private _route: Router) { }
  public showSpinner:boolean
  public spinnerConfig:any;
  ngOnInit() {
    this.spinnerConfig = loadingConfig;

  }

  logout(){
    this.showSpinner=true;
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
}
