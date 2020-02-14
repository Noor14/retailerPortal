import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public supportDropdownValues= new BehaviorSubject<any>(null);
  public signUpBtnToggling = new BehaviorSubject<any>(null);

  constructor() { }

}
