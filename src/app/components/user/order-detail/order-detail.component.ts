import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
 
  @Input() orderList: any;
  public orderDetailList: any[] =[];
  public grossAmount: number = 0;
  public discountColumn: boolean = false;
  public taxColumn: boolean = false;
  constructor() {
   }

  ngOnInit() {
    if (this.orderList && Object.keys(this.orderList).length && this.orderList.orderDetails && this.orderList.orderDetails.length) {
      this.orderDetailList = this.orderList.orderDetails;
      this.discountColumn = this.orderDetailList.some(obj => obj.Discount);
      this.taxColumn = this.orderDetailList.some(obj => obj.TaxValue);
      this.grossAmount =  this.orderDetailList.reduce((total, obj) => {
        return total + obj.UnitPrice * obj.OrderQty;
      }, 0);
    }
  }
}
