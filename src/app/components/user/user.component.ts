import { SharedService } from 'src/app/services/shared.service';
import { routeAnimation } from './../../constant/animations';
import { Component, OnInit } from '@angular/core';
import { TicketSupportService } from './support/ticket-support.service';

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

  constructor(
    private _supportService :TicketSupportService, 
    private _sharedService : SharedService)
    { }

  ngOnInit() {
    this._supportService.getCalls("support/PrivateUsers",7)
    .then((data:any)=>{
      if(data && Object.keys(data).length)
      this._sharedService.supportDropdownValues.next(data);
    })
    .catch(err=>{
      })

  }
  
}
