import { loadingConfig } from './../../constant/globalfunction';
import { UserService } from './../../components/user/user.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateStruct, NgbInputDatepicker, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll, distinctUntilChanged } from 'rxjs/operators';
const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;
@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./searching.component.scss']
})
export class SearchingComponent implements OnInit {

  public showSpinner: boolean;
  public spinnerConfig: any;

  @Input() searchingCriteria: any;
  @Output() filteredData = new EventEmitter();

  public statuses:any[]=[];
  public selectedObject:any={};



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
  constructor(  private renderer: Renderer2, 
    private _parserFormatter: NgbDateParserFormatter,
    private _userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
  }

  selectedOption(option){
    this.selectedObject = this.searchingCriteria.searchBy.find(obj=> obj.key == option);
    console.log(this.filteredData)
  }
  // selectSearch(){
  //   if(this.searchingOption){
  //     // if(this.search.nativeElement && this.search.nativeElement.value){
  //     //   this.getPaymentList(this.searchObj);
  //     //   this.modifySearchObj = Object.assign({}, this.searchObj);
  //     //   this.search.nativeElement.value= '';
  //     // }
  //     this.changeDetectorRef.detectChanges();
  //     fromEvent(this.search && this.search.nativeElement, 'keyup').pipe(
  //       // get value
  //       map((event: any) => {
  //         return event.target.value;
  //       })
  //       // if character length greater then 2
  //       // ,filter(res => res.length > 2)
  //       // Time in milliseconds between key events
  //       ,debounceTime(1000)        
  //       // If previous query is diffent from current   
  //       ,distinctUntilChanged()
  //       // subscription for response
  //       ).subscribe((text: string) => {
  //            if(text){
  //             this.modifySearchObj = Object.assign({}, this.searchObj);
  //             switch(this.searchingOption) {
  //               case 'Company':
  //                 this.modifySearchObj.CompanyName = text
  //                 this.getPaymentList(this.modifySearchObj);
  //                 break;
  //               case 'Payment ID':
  //                 this.modifySearchObj.InvoiceNumber = text
  //                 this.getPaymentList(this.modifySearchObj);
  //                 break;
                
  //               case 'Amount':
  //                 this.modifySearchObj.Amount = text
  //                 this.getPaymentList(this.modifySearchObj);
  //                 break;

  //               case 'Status':
  //                 this.modifySearchObj.Status = text
  //                 this.getPaymentList(this.modifySearchObj);
  //                 break;

  //               case 'Created Date':
  //                 this.modifySearchObj.Amount = text
  //                 this.getPaymentList(this.modifySearchObj);
  //                 break;

               
  //             }
             
  //            }
  //            else{
  //             this.getPaymentList(this.searchObj);
  //             this.modifySearchObj = Object.assign({}, this.searchObj);
  //           }
          
  //       });
  //     }else{
  //       if(this.search.nativeElement && this.search.nativeElement.value){
  //         this.getPaymentList(this.searchObj);
  //         this.modifySearchObj = Object.assign({}, this.searchObj);
  //       }
  //     }
  // }
    searchOnChange(elem){
          if(elem.value){
          let obj:any = {
            [this.selectedObject.key] : elem.value,
          };
            if(this.searchingCriteria.TotalRecords){
              obj.TotalRecords = this.searchingCriteria.TotalRecords;
            }
            if(this.searchingCriteria.PageNumber){
              obj.PageNumber = this.searchingCriteria.PageNumber;
            }
          this.filter(obj);
        }
    }

    filter(obj){
    this.showSpinner=true;
      this._userService.postCalls(this.searchingCriteria.apiEndPoint, obj)
      .then((data:any)=>{
        if(data && data.length){
          let object = {
            data: data,
            [this.selectedObject.key]: obj[this.selectedObject.key],
            searchMode : this.searchingCriteria.searchMode
          }
         this.filteredData.emit(object);
        }
       this.showSpinner=false;
      })
      .catch(err=>{
       this.showSpinner=false;
        console.log(err)
        })
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
}
