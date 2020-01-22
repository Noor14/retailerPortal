import { routeAnimation } from './../../constant/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  animations: [
    routeAnimation
    // animation triggers go here
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AuthenticationComponent implements OnInit {

  public signupBtnToggle: boolean = false;
  constructor(private _sharedService: SharedService) { }

  ngOnInit() {
    this._sharedService.signUpBtnToggling.subscribe((res)=>{
      if(res){
        this.signupBtnToggle = (res =='/login' || res == '/')? true : false;
      }
    })
  }
  activatedRoute(outlet: RouterOutlet){
    if(outlet.isActivated) return outlet.activatedRoute;
  }

}
