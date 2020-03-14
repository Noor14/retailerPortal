import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { loadingConfig } from './../../../constant/globalfunction';
import { OrderDetailService } from './order-detail.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig: any;
  public orderDetailForm: FormGroup;
  private requestId: Number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _orderDetailService: OrderDetailService) {
    this.requestId = this.activatedRoute.snapshot.url[1] && Number(this.activatedRoute.snapshot.url[1].path)
   }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;

    if(this.requestId){
      this.getOrderDetails(this.requestId);
    }
    this.orderDetailForm = new FormGroup({
      CompanyName: new FormControl({ value: null, readOnly: true }, [Validators.required]),
      OrderNumber: new FormControl({ value: null, readOnly: true }, [Validators.required]),
      OrderCreatedDate: new FormControl({ value: null, readOnly: true }, [Validators.required]),
      OrderStatus: new FormControl({ value: null, readOnly: true }, [Validators.required]),
      Comment: new FormControl({ value: null, readOnly: true }, [Validators.required]),
    });
  }
  getOrderDetails(requestId){
    this.showSpinner=true;
  this._orderDetailService.getDetail(requestId).then((data: any) => {
    this.showSpinner=false;
    console.log(data)
    data.OrderPaymentDetails.OrderCreatedDate =  moment(data.OrderCreatedDate).format('DD-MM-YYYY');
    this.orderDetailForm.patchValue(data.OrderPaymentDetails);
  })
  .catch(err => {
    this.showSpinner=false;
  })
}
}
