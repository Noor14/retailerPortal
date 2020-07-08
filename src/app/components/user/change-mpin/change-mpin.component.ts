import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-mpin',
  templateUrl: './change-mpin.component.html',
  styleUrls: ['./change-mpin.component.scss']
})
export class ChangeMPINComponent implements OnInit {

  constructor(private _sharedService: SharedService) { }

  ngOnInit() {
  }
  gotoBack(){
    this._sharedService.setRenderComponent('linkedAccounts');
  }
}
