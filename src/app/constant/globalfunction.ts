import { SPINNER_ANIMATIONS, SPINNER_PLACEMENT } from '@hardpool/ngx-spinner';
import { FormGroup, FormControl } from '@angular/forms';

export const loadingConfig = {
    placement: SPINNER_PLACEMENT.block_window,
    animation: SPINNER_ANIMATIONS.spin_3,
    bgColor:"#76767633",
    size: "60px",
    color: "#96bb3d"
  };


  export function validateAllFormFields(formGroup: FormGroup) {         
  Object.keys(formGroup.controls).forEach(field => {  
    const control = formGroup.get(field);            
    if (control instanceof FormControl) {             
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        
      this.validateAllFormFields(control);            
    }
  });
}