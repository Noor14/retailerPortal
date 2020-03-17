import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[noWhiteSpace]'
})
export class NoWhiteSpaceDirective {
  constructor() { }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    if(event.keyCode == 32 || event.which == 32){
      return false
    }

  }
}
