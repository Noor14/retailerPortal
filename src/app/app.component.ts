import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd , Event} from '@angular/router';
import { SharedService } from './services/shared.service';
import { ConnectionService } from 'ng-connection-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private _router: Router,
    private _sharedService :SharedService,
    private _connectionService: ConnectionService,
    private _toast: ToastrService
   ) { }
  ngOnInit() {
    this._router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd){
        this._sharedService.btnToggling.next(event.url);
      }
    });
    this._connectionService.monitor().subscribe(isConnected => {
      if (!isConnected) {
        this._toast.error("Internet connection lost")
      }

    })
  }

}
