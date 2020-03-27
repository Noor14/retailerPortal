import { Directive, HostListener } from '@angular/core';
import { AppPattern } from '../shared/app.mask';

@Directive({
  selector: '[alphabetsOnly]'
})
export class AlphabetsOnlyDirective {

  constructor() { }
  @HostListener('keypress', ['$event']) onKeyPress(event) {
    let regex = AppPattern.alphabetsOnly;
    if(!event.key.match(regex)){
     return false;
    }
  }

}
