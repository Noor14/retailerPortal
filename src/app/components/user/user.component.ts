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

  public navigationToggle:boolean=false
  constructor()
    { }

  ngOnInit() {}

  
}
