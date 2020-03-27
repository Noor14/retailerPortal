import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppMasks, AppPattern } from 'src/app/shared/app.mask';
import { loadingConfig } from 'src/app/constant/globalfunction';
import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { OrderDetailService } from '../order-detail/order-detail.service';
import { TreeNode } from 'primeng/api/treenode';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderComponent implements OnInit, AfterViewInit {
  public cnicMask = AppMasks.cnic_Mask;
  public mobileMask = AppMasks.mobile_Mask;
  public showSpinner: boolean;
  public spinnerConfig: any;
  public kycList: any[]= [];
  public selectedCompany: string= undefined;
  public companyDetailForm: FormGroup;
  public toggleCompanyProductList:boolean= false;
  public categoryList :TreeNode[]= [];
  private selectedDealerCode:string;
  public orderSummary: any[]=[];
  public activeTab:string = 'placeOrder';
  @ViewChild('tab', {static:false}) public tabs:NgbTabset;
  constructor(
    private _orderDetailService : OrderDetailService,
    private _toast: ToastrService,
    private _route: Router
    ) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    let userObject = JSON.parse(localStorage.getItem('userIdentity')).UserAccount;
    this.getKYCList(userObject.RetailerID);
    this.companyDetailForm = new FormGroup({
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      CNIC: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      CompanyName: new FormControl(null, [Validators.required]),
      CompanyNTN: new FormControl(null, [Validators.required]),
      Address: new FormControl(null, [Validators.required]),
    });
  

  }

  ngAfterViewInit(){
    this.setTableTreeClass()
  }
  onTabChange(event){
    if(event.activeId == "placeOrder" && event.nextId == "orderSummary"){
      if(!this.orderSummary.length){
        event.preventDefault()
      }
    }
    else if(event.activeId == "orderSummary"  && event.nextId == "placeOrder"){
      this.setTableTreeClass()
    }
  }
  setTableTreeClass(){
      setTimeout(()=>{
        let elemWrapper = document.getElementsByClassName('ui-treetable-wrapper')[0];
        let elem = document.getElementsByClassName('ui-treetable-table')[0];
        if(elemWrapper){
          elemWrapper.classList.add('table-responsive');
          elemWrapper.classList.add('gridArea');
          elemWrapper.id="nav-scrollbar";
        }
        if(elem){
          elem.classList.add('table')
        }
      },0)

  }
  getKYCList(requestId){
    this.showSpinner=true;
    this._orderDetailService.getKYCListDetail('kyc/ConnectedKycList',requestId).then((data: any) => {
      this.kycList = data;
      this.showSpinner=false;
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }
  companyDetail(dealerCode){
    let obj = this.kycList.find(obj=> obj.DealerCode == dealerCode);
    this.companyDetailForm.patchValue(obj);
  }
  confirmOrder(){
    if(this.orderSummary.length){
      this.showSpinner=true;
      let obj = {
      ID:0,
      DealerCode:this.selectedDealerCode,
      OrderDetails:this.orderSummary
      }
      this._orderDetailService.orderSave(obj).then((data: any) => {
        if(data.OrderNumber && data.ID){
          this._toast.success("Order Saved");
            this._route.navigate(['/user/dashboard'])
        }
        this.showSpinner=false;
      })
      .catch(err => {
        this.showSpinner=false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
  
      })
    }
   
  }
  selectProduct(product){
    if (!this.orderSummary.length && product.OrderQty){
        this.orderSummary.push(product)
    }else{
      let index = this.orderSummary.findIndex(obj => obj.ProductId == product.ProductId);
      if(index >=0 && !product.OrderQty){
        this.orderSummary.splice(index, 1)
      }
      else if (index >=0 && product.OrderQty){
        this.orderSummary.splice(index, 1, product)
      }
      else{
        this.orderSummary.push(product)
      }
    }
    if (!this.orderSummary.length){
      this.tabs.select('placeOrder');
    }
  }
  companyProducts(dealerCode){
    if(this.selectedDealerCode != dealerCode){
      this.selectedDealerCode = dealerCode
      this.showSpinner=true;
      this._orderDetailService.getKYCListDetail('products/GetProductByDealerCode', dealerCode).then((data: any) => {
        console.log(data)
        this.showSpinner=false;
        this.toggleCompanyProductList = true;
        this.setTableTreeClass();
        if(data && data.SubCategory && data.Products && data.SubCategory.length && data.Products.length){
          this.generateProductCompany(data);
        }else{
          this.categoryList = [];
        }
      })
      .catch(err => {
        this.showSpinner=false;
  
      })
    }else{
      this.setTableTreeClass();
      this.toggleCompanyProductList = true;
    }
  }
  generateProductCompany(data){
      let list = [];
      let dataList = [];
      for (let index = 0; index < data.SubCategory.length; index++) {
        for (let ind = 0; ind < data.Products.length; ind++) {
            if(data.Products[ind].ProductCategoryId == data.SubCategory[index].CategoryId){
              var obj = data.SubCategory[index];
              if(!obj['children']){
                obj['children'] = [];
              }
              let dataObj ={
                data:{...data.Products[ind]}
              }
              let title = dataObj.data.Title;
              dataObj.data.Title = dataObj.data.ProductCode;
              dataObj.data.ProductCode = title
              obj['children'].push(dataObj)
  
            }
        }
        list.push(obj);
      }
      list.forEach((obj, i)=>{
        let child = obj.children;
        delete obj.children;
        let object = {
          data:{...obj},
          children: child
        }
        dataList.push(object)
      })
      this.categoryList = dataList;
    }
    

}
