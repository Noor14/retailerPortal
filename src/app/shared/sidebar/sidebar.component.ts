import { loadingConfig } from './../../constant/globalfunction';
import { UserService } from './../../components/user/user.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() navToggling = new EventEmitter();

  ngOnInit() {
    this.spinnerConfig = loadingConfig;

  }

  logout(){
    this.showSpinner=true;
    this._userService.logoutUser()
    .then((res:boolean)=>{
      if(res){
        this.navToggle();
        localStorage.clear();
        this._route.navigate(['/login'])
      }    
      this.showSpinner=false;
    })
    .catch(err=>{
    this.showSpinner=false;

      })
  }

  navToggle() {
    this.navToggling.emit(false);
  }
}
