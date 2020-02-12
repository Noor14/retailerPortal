import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[noDualSpaceNoSpecial]'
})
export class NoDualSpaceSpecial {
    regexStr = '^[0-9A-Za-z ]*$';
  
  constructor(private el: ElementRef) { }


  @HostListener('input') onInput(event) {
    const length = this.el.nativeElement.value ? this.el.nativeElement.value.length : 0;

   console.log(this.el.nativeElement.value);
  }


  @HostListener('keypress', ['$event']) onKeyPress(event) {
      if(event.charCode==32){
          if(event.target.value[event.target.selectionStart-1]==" "){
              event.preventDefault();
          }
      }
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
        console.log(event);

      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();

    }, 100)
  }

  
}