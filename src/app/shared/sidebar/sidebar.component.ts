import { loadingConfig } from './../../constant/globalfunction';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private _route: Router) { }
  public showSpinner:boolean
  public spinnerConfig:any;
  @Output() navToggling = new EventEmitter();
  @Input() navigationState: boolean;

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
  }
 
  logout(){
    this._route.navigate(['login'],{ queryParams: { logout: true }})
  }

  navToggle() {
    if(this.navigationState){
      this.navToggling.emit(!this.navigationState);
    }
  }
}
