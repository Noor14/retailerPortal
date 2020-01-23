import { routeAnimation } from './../../constant/animations';
import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }
  
}
