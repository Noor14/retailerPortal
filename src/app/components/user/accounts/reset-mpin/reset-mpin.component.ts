import { SharedService } from '../../../../services/shared.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-mpin',
  templateUrl: './reset-mpin.component.html',
  styleUrls: ['./reset-mpin.component.scss']
})
export class ResetMPINComponent implements OnInit {
  public otpToggle: boolean = false;
  public newMPINToggle: boolean = false;
  public confirmMPINToggle: boolean = false;
  constructor(private _sharedService: SharedService) { }

  ngOnInit() {
  }
  gotoBack(){
    this._sharedService.setRenderComponent('linkedAccounts');
  }
}
