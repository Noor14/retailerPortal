import { Injectable } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {

  constructor(private dialog:DialogComponent) { }
  
}
