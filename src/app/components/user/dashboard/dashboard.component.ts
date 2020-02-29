import { DialogComponent } from './../../../shared/dialog-modal/dialog/dialog.component';
import { loadingConfig } from './../../../constant/globalfunction';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { NgbDateStruct, NgbInputDatepicker, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DashboardComponent implements OnInit {
  public showSpinner: boolean;
  public spinnerConfig: any;
  private searchObj: any = {
    TotalRecords: 10,
    PageNumber : 0,
    CompanyName:null,
    DateFrom:null,
    DateTo:null,
    Status:null,
    PaymentAmountMin:null,
    PaymentAmountMax:null,
    InvoiceNumber:null,
  };
  private modifySearchObj = Object.assign({}, this.searchObj);
  public searchingOption:string = '';
  public loadAvailable:boolean = true; 
  public paymentsList: any[]= [];
  public searchBY: string[]= ['Payment ID', 'Company', 'Created Date', 'Status', 'Amount'];
  startDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;
  hoveredDate: NgbDateStruct;
  fromDate: any;
  toDate: any;
  model: any;
  @ViewChild("d", {static: false}) input: NgbInputDatepicker;
  @ViewChild('myRangeInput' , {static: false}) myRangeInput: ElementRef;
  @ViewChild('search', {static: false}) search: ElementRef;

  isHovered = date => 
  this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate)
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  constructor(
    private _dashboardService: DashboardService,
    private renderer: Renderer2, 
    private _parserFormatter: NgbDateParserFormatter,
    private changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _modalService: NgbModal) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    this.getPaymentList(this.searchObj);
  }
  selectSearch(){
    if(this.searchingOption){
      this.changeDetectorRef.detectChanges();
      fromEvent(this.search && this.search.nativeElement, 'keyup').pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        // ,filter(res => res.length > 2)
        // Time in milliseconds between key events
        ,debounceTime(1000)        
        // If previous query is diffent from current   
        ,distinctUntilChanged()
        // subscription for response
        ).subscribe((text: string) => {
             if(text){
              this.modifySearchObj = Object.assign({}, this.searchObj);
              switch(this.searchingOption) {
                case 'Company':
                  this.modifySearchObj.CompanyName = text
                  this.getPaymentList(this.modifySearchObj);
                  break;
                case 'Payment ID':
                  this.modifySearchObj.InvoiceNumber = text
                  this.getPaymentList(this.modifySearchObj);
                  break;
                
                case 'Amount':
                  this.modifySearchObj.Amount = text
                  this.getPaymentList(this.modifySearchObj);
                  break;

                case 'Status':
                  this.modifySearchObj.Status = text
                  this.getPaymentList(this.modifySearchObj);
                  break;

                case 'Created Date':
                  this.modifySearchObj.Amount = text
                  this.getPaymentList(this.modifySearchObj);
                  break;

               
              }
             
             }
             else{
              this.getPaymentList(this.searchObj);
              this.modifySearchObj = Object.assign({}, this.searchObj);
            }
          
        });
      }else{
        if(this.search.nativeElement && this.search.nativeElement.value){
          this.getPaymentList(this.searchObj);
          this.modifySearchObj = Object.assign({}, this.searchObj);
        }
      }
  }

  onDateSelection(date: NgbDateStruct) {
    let parsed = '';
    if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
        this.toDate = date;
        // this.model = `${this.fromDate.year} - ${this.toDate.year}`;
        this.input.close();
    } else {
        this.toDate = null;
        this.fromDate = date;
    }
    if(this.fromDate) {
      parsed += this._parserFormatter.format(this.fromDate);
    }
    if(this.toDate) {
      parsed += ' - ' + this._parserFormatter.format(this.toDate);
    }
   
    this.renderer.setProperty(this.myRangeInput.nativeElement, 'value', parsed);
  }

  filterByStatus(elem){
    if(this.searchingOption){
      if(elem.value){
        this.modifySearchObj = Object.assign({}, this.searchObj);
        this.modifySearchObj.Status = elem.value
        this.getPaymentList(this.modifySearchObj);
       }
       else{
        this.getPaymentList(this.searchObj);
        this.modifySearchObj = Object.assign({}, this.searchObj);
      }
      }
  }

  getPaymentList(searchObj){
    this.showSpinner=true;
    this._dashboardService.postCalls("prepaidrequests/search", searchObj)
    .then((data: any) => {
    this.showSpinner=false;
    if(!searchObj.PageNumber){
      this.paymentsList = data.PrePaidRequestData;
    }else{
      this.paymentsList = this.paymentsList.concat(data.PrePaidRequestData);
    }
    this.loadAvailable = (this.paymentsList.length == data.RecordCount)? false : true;
    })
    .catch(err => {
    this.showSpinner=false;
      console.log(err);
    })
  }

  loadMore(){
    this.modifySearchObj.PageNumber++
    this.getPaymentList(this.modifySearchObj);
  }
 
  openDialog(id :Number){
    const modalRef = this._modalService.open(DialogComponent,{ 
      centered: true,
      keyboard: false,
      backdrop:'static'
     });
    modalRef.componentInstance.obj = {id : id, title: 'Delete Payment', deleteType: 'payment', detail:'Are you sure, you want to delete this payment? '};
    modalRef.result.then((result) => {
      if(result){
        let index = this.paymentsList.findIndex(obj => obj.RetailerInvoiceId == result)
        this.paymentsList.splice(index, 1)
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
