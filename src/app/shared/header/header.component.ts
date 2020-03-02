import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {

  private userInfoSubscriber:any;
  public userDetail: any = {};
  private navToggler:boolean = false;
  @Output() navToggling = new EventEmitter();
  @Input() navigationState: boolean;
  constructor(private _sharedService : SharedService) { }

  ngOnInit() {
    this.userDetail = this._sharedService.getUser();
        if(!this.userDetail){
          let info = localStorage.getItem('userIdentity');
          if(info){
           this.userDetail = JSON.parse(info).UserAccount;
          }
        }
        this.navToggler = this.navigationState;
    }
    ngOnChanges(){
      this.navToggler = this.navigationState;
    }
    navToggle() {
        this.navToggler = !this.navToggler
        this.navToggling.emit(this.navToggler);
    }
    ngOnDestroy(){
      if(this.userInfoSubscriber)
      this.userInfoSubscriber.unsubscribe();
    }

}
