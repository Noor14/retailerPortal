import { AppPattern } from 'src/app/shared/app.mask';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numbersOnly]'
})
export class NumberDirective {

  constructor(private _el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event) {

    let regex = AppPattern.number;
    if(this._el.nativeElement.value.length == 1 && event.data == "0"){
      this._el.nativeElement.value = '';
    }
    else{
      if(event.data && event.data != "0" && !event.data.match(regex)){
        let arr = this._el.nativeElement.value.split('')
        let ind = arr.indexOf(event.data);
        if(ind>=0){
          arr.splice(ind, 1);
          this._el.nativeElement.value = arr.join().replace(/,/g, '')

        }
       }
    }

  }
}
