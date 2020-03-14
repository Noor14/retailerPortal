import { AppPattern } from 'src/app/shared/app.mask';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numbersOnly]'
})
export class NumberDirective {

  constructor(private _el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    let regex = AppPattern.number;
    if(!initalValue.match(regex)){
      this._el.nativeElement.value =  initalValue.replace(/[^\n]+/, '');
      if ( initalValue !== this._el.nativeElement.value){
        event.stopPropagation();
      }
    }
  

  }
}
