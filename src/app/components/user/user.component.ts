import { routeAnimation } from './../../constant/animations';
import { Component, OnInit } from '@angular/core';
import { SupportService } from '../authentication/support/support.service';
import { SharedService } from 'src/app/services/shared.service';
import { SupportSignInService } from './support/supportsign.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    routeAnimation
    // animation triggers go here
  ]
})
export class UserComponent implements OnInit {

  constructor(private _supportService :SupportSignInService,private _sharedService : SharedService) { }

  ngOnInit() {
    this._supportService.getCalls("support/PrivateUsers",7)
    .then((data:any)=>{
      this._sharedService.setDropDownValue(data);

    })
  }
  
}
