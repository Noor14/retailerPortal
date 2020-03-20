import { UserService } from './user.service';
import { SharedService } from './../../services/shared.service';
import { slideInOut } from './../../constant/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    slideInOut
    // animation triggers go here
  ]
})
export class UserComponent implements OnInit {

  public navigationToggle:boolean=false;
  
  constructor(
    private _sharedService :SharedService, 
    private _userService : UserService)
    { }

  ngOnInit() {
      this._userService.getCalls("lookup/null")
      .then((data:any)=>{
        if(data && data.length){
          let obj = data.reduce((r, a) => {
            r[a.type] = [...r[a.type] || [], a];
            return r;
           }, {});
          this._sharedService.dropDownValues.next(obj);
          console.log(obj)
        }
      })
      .catch(err=>{
        console.log(err)
        })

  }

  
}
