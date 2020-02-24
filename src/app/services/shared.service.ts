import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public supportDropdownValues= new BehaviorSubject<any>(null);
  public btnToggling = new BehaviorSubject<any>(null);

  constructor() { }

}
