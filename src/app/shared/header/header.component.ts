import { HttpErrorResponse } from '@angular/common/http';
import { SPINNER_PLACEMENT } from '@hardpool/ngx-spinner';
import { loadingConfig } from './../../constant/globalfunction';
import { UserService } from './../../components/user/user.service';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { WebsocketService } from './../../services/websocket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {

  public userDetail: any = {};
  private navToggler:boolean = false;
  public notifications:any;
  private notificationObj = {
     TotalRecords: 10,
     PageNumber : 0
   }
  @Output() navToggling = new EventEmitter();
  @Input() navigationState: boolean;
  private socketSubscriber:any;
  public spinnerConfig:any;
  public showSpinner: boolean;
  constructor(
    private _sharedService : SharedService,
    private _userService : UserService,
    private socketService: WebsocketService) { 

    }

  ngOnInit() {
   let spinnerConfig = Object.assign({}, loadingConfig);
   spinnerConfig.placement = SPINNER_PLACEMENT.block_ui;
   spinnerConfig.size = "45px";
   this.spinnerConfig = spinnerConfig;
    this.userDetail = this._sharedService.getUser();
        if(!this.userDetail){
          let info = localStorage.getItem('userIdentity');
          if(info){
           this.userDetail = JSON.parse(info).UserAccount;
          }
        }
        if(!this.socketSubscriber){
          this.socketService.emit('userId', this.userDetail.UserId);
        }
        this.socketSubscriber = this.socketService.connect('userId', this.userDetail.UserId).subscribe((res: any)=>{
          this.notifications = res;
        })
        this.navToggler = this.navigationState;
    }
    ngOnDestroy(){
      this.socketSubscriber && this.socketSubscriber.unsubscribe();
      this.socketService.socket && this.socketService.socket.disconnect();
    }
    ngOnChanges(){
      this.navToggler = this.navigationState;
    }
    seenNotification(){
      if(this.notifications.UnSeenCount){
        this._userService.seenNotification().then(res => {
        }).catch((err: HttpErrorResponse)=>{
  
        })
      }
   
    }
    removeNotification(notId){
      this.showSpinner = true;
      this._userService.removeNotification(notId).then(res => {
        this.showSpinner = false;
      }).catch((err: HttpErrorResponse)=>{
        this.showSpinner = false;

      })
    }
    loadMoreNotify(){
      this.notificationObj.PageNumber++
      this.showSpinner = true;
      this._userService.getNotification(this.notificationObj).then(res => {
        this.showSpinner = false;
      }).catch((err: HttpErrorResponse)=>{
        this.showSpinner = false;

      })
    }
    navToggle() {
        this.navToggling.emit(!this.navToggler);
    }
   

}
