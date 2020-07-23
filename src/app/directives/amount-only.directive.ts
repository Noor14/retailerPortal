import { AppPattern } from 'src/app/shared/app.mask';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[amountsOnly]'
})
export class AmountDirective {

 // Allow key codes for special events. Reflect :
 // Backspace, tab, end, home
 private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

constructor(private el: ElementRef) {
 }
 @HostListener('keydown', [ '$event' ])
 onKeyDown(event: KeyboardEvent) {
    const regex = AppPattern.amount;
      // Allow Backspace, tab, end, and home keys
      if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
      }
      let current: string = this.el.nativeElement.value;
      let next: string = current.concat(event.key);
      if(current && event.key != '0' && String(event.key).match(regex) && next && next.length <= 9){
        return;
      }
      else if (next && !String(next).match(regex)) {
      event.preventDefault();
      }
      else if(next && next.length > 9){
        event.preventDefault();
      }
 }

}
