import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd , Event} from '@angular/router';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private _router: Router, private _sharedService: SharedService) { }
  ngOnInit() {
    this._router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd && (event.url == '/registration' ||  event.url == '/login' ||  event.url == '/')){
        this._sharedService.signUpBtnToggling.next(event.url);
      }
    });
    
  }
}
