import { SharedService } from './../../../services/shared.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-mpin',
  templateUrl: './create-mpin.component.html',
  styleUrls: ['./create-mpin.component.scss']
})
export class CreateMPINComponent implements OnInit {

  constructor(private _sharedService: SharedService) { }

  ngOnInit() {
  }
  gotoBack(){
    this._sharedService.setRenderComponent('linkedAccounts');
  }

}
