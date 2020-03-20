import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  public signupBtnToggle: boolean = true;
  public supportBtnToggle: boolean = true;
  private btnTogglingSubscription: any;
  constructor(
    private _sharedService: SharedService) { }

  ngOnInit() {
    this.btnTogglingSubscription = this._sharedService.btnToggling.subscribe((res)=>{
      if(res){
        this.signupBtnToggle = (res =='/registration')? false : true;
        this.supportBtnToggle = (res =='/support')? false : true;
      }
    })
  }
  ngOnDestroy(){
    this.btnTogglingSubscription.unsubscribe();
  }

}
