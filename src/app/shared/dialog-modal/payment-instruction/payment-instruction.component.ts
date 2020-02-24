import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  styleUrls: ['./payment-instruction.component.scss']
})
export class PaymentInstructionComponent implements OnInit {
  @Input() obj:any;
  public paymentInstructions: any;

  constructor(
    public activeModal: NgbActiveModal,

  ) { }

  ngOnInit() {
    if(this.obj && Object.keys(this.obj).length){
      this.paymentInstructions = this.obj;
    }
  }
  

}
