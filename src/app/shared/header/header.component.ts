import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userInfoSubscriber:any;
  public userDetail: any = {};
  constructor(private _sharedService : SharedService) { }

  ngOnInit() {
      this.userInfoSubscriber = this._sharedService.userInfo.subscribe((res:any)=>{
        if(res){
          this.userDetail = res;
        }else{
         let info = localStorage.getItem('userIdentity');
         if(info){
          this.userDetail = JSON.parse(info).UserAccount;
         }
        }
      });
  }
  ngOnDestroy(){
    if(this.userInfoSubscriber)
    this.userInfoSubscriber.unsubscribe();
  }

}
