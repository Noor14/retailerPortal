import { DialogComponent } from './../../../shared/dialog-modal/dialog/dialog.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppMasks, AppPattern } from 'src/app/shared/app.mask';
import { loadingConfig } from 'src/app/constant/globalfunction';
import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { OrderDetailService } from '../order-detail/order-detail.service';
import { TreeNode } from 'primeng/api/treenode';
import { NgbTabset, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  public selectedTemplateID: undefined;
  public selectedTemplate: any;
  private userObject: any;
  public orderSummary: any[]=[];
  public templateList: any[] = [];
  public activeTab:string = 'placeOrder';
  public netAmount: number = 0;
  public totalDiscount: number = 0;
  public grossAmount: number = 0;
  private compareValueToCalculateSummary:number;
  private compareValueAfterToBeforeValue: number;
  private selectedDraftID = undefined;
  public orderplacementStage: boolean = false;
  @ViewChild('tab', {static:false}) public tabs:NgbTabset;
  constructor(
    private _orderDetailService : OrderDetailService,
    private _toast: ToastrService,
    private _route: Router,
    private _modalService: NgbModal,

    ) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.userObject = JSON.parse(localStorage.getItem('userIdentity')).UserAccount;
    this.getKYCList(this.userObject.RetailerID);
    this.companyDetailForm = new FormGroup({
      Email: new FormControl({value:null, disabled:true}, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl({value:null, disabled:true}, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      CNIC: new FormControl({value:null, disabled:true}, [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      CompanyName: new FormControl({value:null, disabled:true}, [Validators.required]),
      CompanyNTN: new FormControl({value:null, disabled:true}, [Validators.required]),
      Address: new FormControl({value:null, disabled:true}, [Validators.required]),
    });
  

  }

  ngAfterViewInit(){
    this.setTableTreeClass();
  }
  onTabChange(event){
    if(event.nextId == "orderSummary"){
      if(!this.orderSummary.length){
        event.preventDefault();
      }else{
        this.checkOrderStage();
        if(this.orderplacementStage){
          this.calculateSummary();
        }
      }
    }
    else if(event.nextId == "placeOrder"){
      this.setTableTreeClass();
      if(this.selectedTemplateID && this.selectedTemplateID != "undefined" && this.compareValueToCalculateSummary != this.compareValueAfterToBeforeValue){
        this.fillProductsInfo(this.orderSummary);
        this.compareValueToCalculateSummary = this.compareValueAfterToBeforeValue;
      }
    }
  }
  onSelectedTemplate(templateId){
    this.orderSummary = [];
    this.categoryList.forEach(obj => {
      if(obj.children.length){
        obj.children.map(item=>{item.data['OrderQty'] = undefined})
      }
    })
    if(templateId != 'undefined'){
      this.showSpinner = true;
      this._orderDetailService.getTemplateDetail('ordertemplate/GetByTemplateID', templateId, this.selectedDealerCode).then((data: any) => {
        if(data && data.OrderTemplateDetails && data.OrderTemplateDetails.length){
          this.orderSummary = data.OrderTemplateDetails.map(obj => {
            obj.ProductUnitPrice = obj.UnitPrice;
            obj.UnitOFMeasure = obj.UOMTitle;
            obj.ProductCode = obj.Title;;
            obj.Title = obj.Code;
            return obj;
          });
          this.selectedTemplate = data.OrderTemplate[0];
          this.tabs.select('orderSummary');
          this.fillProductsInfo(this.orderSummary);
        }
        this.showSpinner=false;
      })
      .catch(err => {
        this.showSpinner=false;
      })
    }

  }
  fillProductsInfo(orderSummary){
    for (let index = 0; index < this.categoryList.length; index++) {
        for (let ind = 0; ind < orderSummary.length; ind++) {
          if(this.categoryList[index].data.CategoryId == orderSummary[ind].CategoryId){
            for (let child = 0; child < this.categoryList[index].children.length; child++) {
                if(this.categoryList[index].children[child].data.ProductId == orderSummary[ind].ProductId){
                  this.categoryList[index].children[child].data.OrderQty = orderSummary[ind].OrderQty
                }
            }
          }
          
        }
      
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
  openDialog(){
    if(this.orderSummary.length && this.orderplacementStage){
      const modalRef = this._modalService.open(DialogComponent,{ 
        centered: true,
        keyboard: false,
        backdrop:'static'
      });
      let obj = {
        ID: (this.selectedTemplate && this.selectedTemplateID && this.selectedTemplateID != 'undefined')? this.selectedTemplate.ID : 0, 
        DealerCode:this.selectedDealerCode,
        RetailerCode:this.userObject.RetailerCode,
        Status:1,
        Name: (this.selectedTemplate && this.selectedTemplateID && this.selectedTemplateID != 'undefined')? this.selectedTemplate.Name : undefined,
        OrderTemplateDetails: this.orderSummary.filter(obj=> obj.OrderQty)
        }
      modalRef.componentInstance.obj = {object : obj, btnText: 'Save', title: 'Save Template', mode: 'orderTemplate', inputBox: true};
      modalRef.result.then((result) => {
        if(result && Object.keys(result).length){
          if(this.selectedTemplateID && this.selectedTemplateID != 'undefined'){
            let obj = this.templateList.find(obj=> obj.ID == this.selectedTemplateID);
            obj.Name = result.templateName;
            let index = this.templateList.findIndex(obj=> obj.ID == this.selectedTemplateID);
            this.templateList.splice(index, 1, obj);
            this.selectedTemplateID = undefined;
          }else{
            let obj = {
              ID: result.id,
              Name: result.templateName,
              DealerCode: this.selectedDealerCode
            }
            this.templateList.push(obj);
          }
          // this.orderSummary = [];
          // this.categoryList.forEach(obj => {
          //   if(obj.children.length){
          //     obj.children.map(item=>{item.data['OrderQty'] = undefined})
          //   }
          // })
          // this.tabs.select('placeOrder');
        }
      }, (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }
  getKYCList(requestId){
    this.showSpinner=true;
    this._orderDetailService.getKYCAndTemplateListDetail('kyc/ConnectedKycList', requestId).then((data: any) => {
      this.kycList = data;
      this.showSpinner=false;
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }

  getTemplateList(dealerCode){
    this.showSpinner=true;
    this._orderDetailService.getKYCAndTemplateListDetail('ordertemplate/GetAllByDealerCode', dealerCode).then((data: any) => {
      if(data){
        this.templateList = data;
      }
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

  nodeToggling(event){
    this.categoryList.filter(obj => obj.data.CategoryId != event.node.data.CategoryId && obj.expanded).map((elem)=> {elem.expanded = false;})
  }

  saveDraft(){
    if(this.orderSummary.length && this.orderplacementStage){
      this.showSpinner=true;
      let obj = {
      ID:(!this.selectedDraftID)? 0 : this.selectedDraftID,
      DealerCode:this.selectedDealerCode,
      OrderDetails: this.orderSummary.filter(obj=> obj.OrderQty)
      }
      this._orderDetailService.save('Orders/draft', obj).then((data: any) => {
        if(data.OrderNumber && data.ID){
          this._toast.success("Order saved");
          this.selectedDraftID = data.ID
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

  confirmOrder(){
    if(this.orderSummary.length && this.orderplacementStage){
      this.orderSummary = this.orderSummary.filter(obj=> obj.OrderQty);
      this.showSpinner=true;
      let obj = {
      ID:0,
      DealerCode:this.selectedDealerCode,
      OrderDetails:this.orderSummary
      }
      this._orderDetailService.save('Orders/saveOrder', obj).then((data: any) => {
        if(data.OrderNumber && data.ID){
          this._toast.success("Order created");
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
        this.orderSummary.splice(index, 1);
        product.OrderQty = undefined;
      }
      else if (index >=0 && product.OrderQty){
        this.orderSummary.splice(index, 1, product)
      }
      else{
        if(product.OrderQty){
          this.orderSummary.push(product)
        }  
      }
    }
    if (!this.orderSummary.length){
      this.tabs.select('placeOrder');
    }
  }
  checkOrderStage(order?, index?){
    if(this.orderSummary.length){
     this.orderplacementStage = this.orderSummary.some(obj => obj.OrderQty);
     if(order && order.OrderQty && order.OrderQty != this.compareValueToCalculateSummary){
     this.compareValueAfterToBeforeValue = order.OrderQty;
      this.calculateSummary();
     }
     else if(order && !order.OrderQty){
     this.compareValueAfterToBeforeValue = order.OrderQty;
      this.deleteSummaryRow(index)
    }
    }
  
  }
  checkValue(currentValue){
    this.compareValueToCalculateSummary = currentValue;
  }
  calculateSummary(){
    this.netAmount = 0;
    this.grossAmount = 0;
    this.totalDiscount = 0;
    this.orderSummary.filter(obj => obj.OrderQty).forEach(obj => {
      this.netAmount += obj.OrderQty * (obj.ProductUnitPrice - obj.DiscountAmount) * obj.PackSize;
      this.grossAmount += obj.ProductUnitPrice * obj.OrderQty * obj.PackSize;
      this.totalDiscount += obj.DiscountAmount  * obj.OrderQty * obj.PackSize;
    });
  }
  deleteSummaryRow(index){
    if(this.orderSummary.length){
      const modalRef = this._modalService.open(DialogComponent,{ 
        centered: true,
        keyboard: false,
        backdrop:'static'
      });
      modalRef.componentInstance.obj = {btnText: 'Yes, I want', titleTextColor: 'warning', title: 'Delete Product', detail: 'Are you sure, you want to delete this product', mode: 'confirmDialog'};
      modalRef.result.then((result) => {
        if(result){
          this.categoryList.forEach(obj => {
            if(obj.children.length){
              obj.children.map(item=>{
                if(item.data.ProductId == this.orderSummary[index].ProductId){
                  item.data['OrderQty'] = undefined;
                }
               return item;
              }
              )
            }
          })
          this.orderSummary.splice(index, 1);
          if(!this.orderSummary.length){
            this.tabs.select('placeOrder');
          }
        }
      }, (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }
  companyProducts(dealerCode){
    if(this.selectedDealerCode != dealerCode){
      this.selectedDealerCode = dealerCode;
     this.getTemplateList(dealerCode);
     this.showSpinner=true;
      this._orderDetailService.getKYCAndTemplateListDetail('products/GetProductByDealerCode', dealerCode).then((data: any) => {
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
        let object
        for (let ind = 0; ind < data.Products.length; ind++) {
            if(data.Products[ind].ProductCategoryId == data.SubCategory[index].CategoryId){
             let obj = data.SubCategory[index];
              if(!obj['children']){
                obj['children'] = [];
              }
              let dataObj ={
                data:{...data.Products[ind]}
              }
              let title = dataObj.data.Title;
              dataObj.data.Title = dataObj.data.ProductCode;
              dataObj.data.ProductCode = title
              obj['children'].push(dataObj);
              object = obj
            }
        }
        if(object && Object.keys(object).length ){
          list.push(object);
        }
      }
      if(list && list.length){
        list.forEach((obj)=>{
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
    

}
