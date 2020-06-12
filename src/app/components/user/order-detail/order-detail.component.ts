import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
 
  @Input() orderList: any;
  public orderDetailList: any[] =[];
  public netAmount: number = 0;
  public grossAmount: number = 0;
  constructor() {
   }

  ngOnInit() {
    if(this.orderList && Object.keys(this.orderList).length && this.orderList.orderDetails && this.orderList.orderDetails.length){
      this.orderDetailList = this.orderList.orderDetails;
      this.orderDetailList.forEach(obj => {
        this.netAmount += obj.TotalPrice;
        this.grossAmount += obj.UnitPrice * obj.OrderQty;
      });
    }
  }
}
