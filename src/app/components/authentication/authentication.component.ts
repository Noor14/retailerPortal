import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SupportService } from './support/support.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  public signupBtnToggle: boolean = true;
  private signupBTnSubscription: any;
  constructor(private _sharedService: SharedService,private _supportService: SupportService) { }

  ngOnInit() {
    this.signupBTnSubscription = this._sharedService.signUpBtnToggling.subscribe((res)=>{
      if(res){
        this.signupBtnToggle = (res =='/registration')? false : true;
      }
    })
    this._supportService.getCalls("support/PublicUsers")
    .then((data:any)=>{
      if(data && Object.keys(data).length){
        this._sharedService.supportDropdownValues.next(data);
      }
    })
  }
  ngOnDestroy(){
    this.signupBTnSubscription.unsubscribe();
  }

}
