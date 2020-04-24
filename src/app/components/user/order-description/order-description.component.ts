import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-order-description',
  templateUrl: './order-description.component.html',
  styleUrls: ['./order-description.component.scss']
})
export class OrderDescriptionComponent implements OnInit, OnChanges {
  @Input() orderDescription:any;
  public orderDetailForm: FormGroup;

  constructor() { }

  ngOnInit() {}
  
  ngOnChanges(){
    this.orderDetailForm = new FormGroup({
      CompanyName: new FormControl({value:null, disabled:true}, [Validators.required]),
      OrderNumber: new FormControl({value:null, disabled:true}, [Validators.required]),
      OrderCreatedDate: new FormControl({value:null, disabled:true}, [Validators.required]),
      OrderStatus: new FormControl({value:null, disabled:true}, [Validators.required]),
      Comment: new FormControl({value:null, disabled:true}, [Validators.required]),
    });
    if(this.orderDescription && Object.keys(this.orderDescription).length){
      this.orderDescription.OrderCreatedDate =  moment(this.orderDescription.OrderCreatedDate,'DD-MM-YYYY').format('DD-MM-YYYY');
      this.orderDetailForm.patchValue(this.orderDescription);
    }
  }

}
