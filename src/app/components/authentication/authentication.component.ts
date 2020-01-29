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
  private signupBTnSubscription: any;
  constructor(private _sharedService: SharedService) { }

  ngOnInit() {
    this.signupBTnSubscription = this._sharedService.signUpBtnToggling.subscribe((res)=>{
      if(res){
        this.signupBtnToggle = (res =='/registration')? false : true;
      }
    })
  }
  ngOnDestroy(){
    this.signupBTnSubscription.unsubscribe();
  }

}
