import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd , Event} from '@angular/router';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private _router: Router,
    private _sharedService :SharedService) { }
  ngOnInit() {
    this.getAllList();
    this._router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd){
        this._sharedService.btnToggling.next(event.url);
      }
    });
    
  }
  getAllList(){
    this._sharedService.getCalls("lookup/null")
    .then((data:any)=>{
      if(data && data.length){
        let obj = data.reduce((r, a) => {
          r[a.type] = [...r[a.type] || [], a];
          return r;
         }, {});
        this._sharedService.dropDownValues.next(obj);
        console.log(obj);
      }
    })
    .catch(err=>{
      console.log(err)
      })
  }
}
