import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public supportDropdownValues= new BehaviorSubject<any>(undefined);
  public btnToggling = new BehaviorSubject<any>(undefined);
  public userInfo = new BehaviorSubject<any>(undefined);

  constructor() { }

}
