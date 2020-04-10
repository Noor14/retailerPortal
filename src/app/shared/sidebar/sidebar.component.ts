import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public showSpinner: boolean;
  private loadingSubscriber:any;
  constructor(
     private _route: Router,
     private _sharedService: SharedService) { }

  @Output() navToggling = new EventEmitter();
  @Input() navigationState: boolean;

  ngOnInit() {
   this.loadingSubscriber = this._sharedService.loadingLogOut.subscribe( res => {
      if(res != undefined){
        if(!res){
          this._sharedService.loadingLogOut.next(undefined)
          this.navToggle();
        }
        this.showSpinner = res;
      }
    });
  }
  ngOnDestroy(){
    this.loadingSubscriber.unsubscribe();
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
