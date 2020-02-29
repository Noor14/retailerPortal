import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public supportDropdownValues= new BehaviorSubject<any>(undefined);
  public btnToggling = new BehaviorSubject<any>(undefined);
  
  private userInfo = new BehaviorSubject<any>(undefined);
  public getUserInfo = this.userInfo.asObservable();

  constructor() { }

  setUser(data) {
    this.userInfo.next(data);
  }
  getUser() {
    return this.userInfo.getValue();
  }
}
