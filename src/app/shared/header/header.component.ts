import { Component, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { WebsocketService } from './../../services/websocket.service';
import { Subject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {

  public userDetail: any = {};
  private navToggler:boolean = false;
  public notifications:any;
  public unreadMessages : boolean = false;
  @Output() navToggling = new EventEmitter();
  @Input() navigationState: boolean;
  private socketSubscriber:any;
  constructor(
    private _sharedService : SharedService,
    private socketService: WebsocketService) { 

    }

  ngOnInit() {
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
          console.log(res)
          this.notifications = res.data;
          if(res && res.count){
            this.unreadMessages = this.notifications.some(elem => !elem.seen)
          }
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
    navToggle() {
        this.navToggling.emit(!this.navToggler);
    }
   

}
