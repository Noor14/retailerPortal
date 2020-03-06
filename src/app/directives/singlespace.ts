import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[noWhiteSpace]'
})
export class NoWhiteSpace {
    regexStr = '^[|~_+<>!@#$%^&*(),.?":{}0-9A-Za-z]*$';
  
  constructor(private el: ElementRef) { }


  @HostListener('input') onInput(event) {
    const length = this.el.nativeElement.value ? this.el.nativeElement.value.length : 0;

    // if (length > this.specialIsAlphaNumeric) {
    //   this.el.nativeElement.value = this.el.nativeElement.value.substr(0, length - 1);
    // }
  }


  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {

      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();

    }, 100)
  }

  
}