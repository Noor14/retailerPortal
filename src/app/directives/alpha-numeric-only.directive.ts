import { Directive, HostListener, ElementRef } from '@angular/core';
import { AppPattern } from '../shared/app.mask';

@Directive({
  selector: '[alphaNumericOnly]'
})
export class AlphaNumericOnlyDirective {

  constructor(private _el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event) {

    let regex = AppPattern.alphaNumericOnly;
    if(this._el.nativeElement.value.length == 1 && event.data != null && event.data.trim() == ""){
      this._el.nativeElement.value = '';
    }
    else{
      if(event.data && event.data != " " && !this._el.nativeElement.value.match(regex)){
        let arr = this._el.nativeElement.value.split('')
        let ind = arr.indexOf(event.data);
        if(ind>=0){
          arr.splice(ind, 1);
          this._el.nativeElement.value = arr.join().replace(/,/g, '').trim()

        }
       }
    }

  }
}
