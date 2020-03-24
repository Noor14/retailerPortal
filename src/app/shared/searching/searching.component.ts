import { loadingConfig } from './../../constant/globalfunction';
import { UserService } from './../../components/user/user.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbDateStruct, NgbInputDatepicker, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';

const now = moment();
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
export class SearchingComponent implements OnInit, OnDestroy {

  public showSpinner: boolean;
  public spinnerConfig: any;
  private selectedKey: any = undefined;
  @Input() searchingCriteria: any;
  @Output() filteredData = new EventEmitter();

  public statuses:any[]=[];
  public selectedObject:any={};
  private searchingobj:any= {}
  private onTypeSubscriber:any;

  startDate: NgbDateStruct;
  maxDate: NgbDateStruct = { year: now.year(), month: now.month() + 1, day: now.date()};
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
  ngOnDestroy(){
    if(this.onTypeSubscriber){
      this.onTypeSubscriber.unsubscribe();
    }
  }
  selectedOption(option){
    this.selectedObject = this.searchingCriteria.searchBy.find(obj=> obj.key == option);
    if(this.selectedObject && this.selectedObject.type == "typing" && !this.selectedKey){
      this.searchOntyping();
    }
    else if(this.selectedKey){
      if(this.onTypeSubscriber){
        this.onTypeSubscriber.unsubscribe();
        if(this.selectedObject && this.selectedObject.type == "typing"){
          this.searchOntyping();
        }
      }
      if(this.searchingCriteria.TotalRecords){
        this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
      }
      if(this.searchingCriteria.PageNumber == 0){
        this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
      }
      delete this.searchingobj[this.selectedKey];
      this.filter(this.searchingobj);
      this.selectedKey = undefined;
      if (this.search && this.search.nativeElement && this.search.nativeElement.value){
        this.search.nativeElement.value = '';
      }
      if(this.selectedObject && this.selectedObject.type == "typing" && !this.selectedKey){
        this.searchOntyping();
      }
    }
  
  }

  searchOntyping(){
      this.changeDetectorRef.detectChanges();
      this.onTypeSubscriber = fromEvent(this.search && this.search.nativeElement, 'keyup').pipe(
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
              this.selectedKey = this.selectedObject.key;
              this.searchingobj = {
                [this.selectedObject.key] : text.trim(),
              };
                if(this.searchingCriteria.TotalRecords){
                  this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
                }
                if(this.searchingCriteria.PageNumber == 0){
                  this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
                }
              this.filter(this.searchingobj);
          
        });
      }

    searchOnChange(elem){
          if(elem.value && [this.selectedObject.key]){
          this.selectedKey = this.selectedObject.key
          this.searchingobj = {
            [this.selectedObject.key] : elem.value,
          };
            if(this.searchingCriteria.TotalRecords){
              this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
            }
            if(this.searchingCriteria.PageNumber == 0){
              this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
            }
          this.filter(this.searchingobj);
        }
        else if(!elem.value && this.selectedKey){
          if(this.searchingCriteria.TotalRecords){
            this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
          }
          if(this.searchingCriteria.PageNumber == 0){
            this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
          }
          delete this.searchingobj[this.selectedKey];
          this.filter(this.searchingobj);
        }
    }

    filter(obj){
      this.showSpinner = true;
        this._userService.postCalls(this.searchingCriteria.apiEndPoint, obj)
        .then((data:any)=>{
          if(data && Object.keys(data).length){
            let object = {
              data: data,
              searchMode : this.searchingCriteria.searchMode
            }
              if(this.selectedObject && this.selectedObject.key && this.selectedKey){
                var objkeyObj ={
                  [this.selectedObject.key]: obj[this.selectedKey],
                }
              }
           let resObj = {...object, ...objkeyObj}; 
          this.filteredData.emit(resObj);
          }
        this.showSpinner = false;
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
