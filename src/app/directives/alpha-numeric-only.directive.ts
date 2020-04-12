import { Directive, HostListener, ElementRef } from '@angular/core';
import { AppPattern } from '../shared/app.mask';

@Directive({
  selector: '[alphaNumericOnly]'
})
export class AlphaNumericOnlyDirective {
  
 // Allow key codes for special events. Reflect :
 // Backspace, tab, end, home
 private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

 constructor(private el: ElementRef) {
  }
  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
     let regex=AppPattern.alphaNumericOnly;
       // Allow Backspace, tab, end, and home keys
       if (this.specialKeys.indexOf(event.key) !== -1) {
       return;
       }
       let current: string = this.el.nativeElement.value;
       let next: string = current.concat(event.key);
       if (next && !String(next).match(regex)) {
       event.preventDefault();
       }
  }

}
