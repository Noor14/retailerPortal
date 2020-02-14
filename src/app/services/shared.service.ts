import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private supportDropdownValues :any[];
  constructor() { }

  public signUpBtnToggling = new BehaviorSubject<any>(null);

  setDropDownValue(data){
    this.supportDropdownValues = data;
  }
  getDropDownValue(){
    return this.supportDropdownValues;
  }
}
