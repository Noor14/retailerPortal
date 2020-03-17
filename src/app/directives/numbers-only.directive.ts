import { AppPattern } from 'src/app/shared/app.mask';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numbersOnly]'
})
export class NumberDirective {

  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onKeyPress(event) {
    let regex = AppPattern.number;
    if(!event.key.match(regex)){
    return false;
    }
  }
}
