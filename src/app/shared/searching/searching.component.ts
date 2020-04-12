import { DateFormater } from './../../constant/date-formater';
import { UserService } from './../../components/user/user.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbDateStruct, NgbInputDatepicker, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

const now = moment();

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./searching.component.scss'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: DateFormater}
   ]
})
export class SearchingComponent implements OnInit, OnDestroy {

  public showSpinner: boolean;
  private selectedKey: any = undefined;
  @Input() searchingCriteria: any;
  @Output() filteredData = new EventEmitter();

  public searchingOption:any =undefined;
  public statuses:any[]=[];
  public selectedObject:any={};
  private searchingobj:any= {}
  private onTypeSubscriber:any;
  private onRangeSubscriberOne:any;
  private onRangeSubscriberTwo:any;
  private onDateSubscriberOne:any;
  private onDateSubscriberTwo:any;
  public maxDate: NgbDateStruct = { year: now.year(), month: now.month() + 1, day: now.date()};

  public fromDate: NgbDateStruct;
  public toDate: NgbDateStruct;
  private inputCurrentDate:any;
  private inputRemovingCurrentDate;
  @ViewChild('search', {static: false}) search: ElementRef;
  @ViewChild('searchRangeOne', {static: false}) searchRangeOne: ElementRef;
  @ViewChild('searchRangeTwo', {static: false}) searchRangeTwo: ElementRef;
  @ViewChild('dateSearchOne', {static: false}) dateSearchOne: ElementRef;
  @ViewChild('dateSearchTwo', {static: false}) dateSearchTwo: ElementRef;

  constructor(  private renderer: Renderer2, 
    private _userService: UserService,
    private _toast:ToastrService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.unSubscriber();
  }

  unSubscriber(){
    if(this.onTypeSubscriber){
      this.onTypeSubscriber.unsubscribe();
    }
    if(this.onRangeSubscriberOne){
      this.onRangeSubscriberOne.unsubscribe();
    }
    if(this.onRangeSubscriberTwo){
      this.onRangeSubscriberTwo.unsubscribe();
    }
    if(this.onDateSubscriberOne){
      this.onDateSubscriberOne.unsubscribe();
    }
    if(this.onDateSubscriberTwo){
      this.onDateSubscriberTwo.unsubscribe();
    }
  }
  selectedOption(option){
    this.fromDate = null;
    this.toDate = null;
    this.unSubscriber();
    this.selectedObject = this.searchingCriteria.searchBy.find(obj=> obj.key == option);
    if(this.selectedObject && this.selectedObject.type == "typing" && !this.selectedKey){
      this.searchOntyping();
    }
    else if(this.selectedObject && this.selectedObject.type == "range" && !this.selectedKey){
      this.searchOnRange();
    }
    else if(this.selectedKey){
      if(this.selectedObject && this.selectedObject.type == "typing"){
          this.searchOntyping();
      }else if(this.selectedObject && this.selectedObject.type == "range"){
        this.searchOnRange();
      }
      if(this.searchingCriteria.TotalRecords){
        this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
      }
      if(this.searchingCriteria.PageNumber == 0){
        this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
      }
      if(Array.isArray(this.selectedKey)){
        delete this.searchingobj[this.selectedKey[0]];
        delete this.searchingobj[this.selectedKey[1]];
      }else{
        delete this.searchingobj[this.selectedKey];
      }
      this.filter(this.searchingobj);
      this.selectedKey = undefined;
      if (this.search && this.search.nativeElement && this.search.nativeElement.value){
        this.search.nativeElement.value = '';
      }
      if (this.searchRangeOne && this.searchRangeOne.nativeElement && this.searchRangeOne.nativeElement.value){
        this.searchRangeOne.nativeElement.value = '';
      }
      if (this.searchRangeTwo && this.searchRangeTwo.nativeElement && this.searchRangeTwo.nativeElement.value){
        this.searchRangeTwo.nativeElement.value = '';
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
              this.searchingobj = {};
              if(text.trim()){
                this.searchingobj[this.selectedObject.key] = text.trim();
              }else{
                delete this.searchingobj[this.selectedObject.key];
                this.selectedKey = undefined;
              }
              if(this.searchingCriteria.TotalRecords){
                this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
              }
              if(this.searchingCriteria.PageNumber == 0){
                this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
              }
              this.filter(this.searchingobj);
        });
  }


  searchOnRange(){
    this.searchingobj = {};
    if(this.searchingCriteria.TotalRecords){
      this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
    }
    if(this.searchingCriteria.PageNumber == 0){
      this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
    }
    this.changeDetectorRef.detectChanges();
    this.onRangeSubscriberOne = fromEvent(this.searchRangeOne && this.searchRangeOne.nativeElement, 'keyup').pipe(
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
            if(Number(text.trim())){
              this.searchingobj[this.selectedObject.key[0]] = text.trim();
            }else{
              delete this.searchingobj[this.selectedObject.key[0]];
              if(Object.keys(this.searchingobj).length==2){
                this.selectedKey = undefined;
              }
            }
           
            this.filter(this.searchingobj);
      });



      this.onRangeSubscriberTwo = fromEvent(this.searchRangeTwo && this.searchRangeTwo.nativeElement, 'keyup').pipe(
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
              if(Number(text.trim())){
                this.searchingobj[this.selectedObject.key[1]] = text.trim();
              }else{
                delete this.searchingobj[this.selectedObject.key[1]];
                if(Object.keys(this.searchingobj).length==2){
                  this.selectedKey = undefined;
                }
              }
              this.filter(this.searchingobj);
        });
}


  searchOnDateRemoving(){
    this.searchingobj = {};
    if(this.searchingCriteria.TotalRecords){
      this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
    }
    if(this.searchingCriteria.PageNumber == 0){
      this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
    }
    if(this.fromDate){
      this.searchingobj[this.selectedObject.key[0]] = moment(`${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`, 'YYYY-M-D').toISOString();
    }
    if(this.toDate){
      this.searchingobj[this.selectedObject.key[1]] = moment(`${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`, 'YYYY-M-D').toISOString();
    }
     
    this.changeDetectorRef.detectChanges();
    this.onDateSubscriberOne  = fromEvent(this.dateSearchOne && this.dateSearchOne.nativeElement, 'keyup').pipe(
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
        // if(text != dateCasting){
            this.selectedKey = this.selectedObject.key;
              if(text && text.trim() &&  moment(text.trim()).isValid()){
                this.searchingobj[this.selectedObject.key[0]] = moment(text.trim()).toISOString();
              }else{
                delete this.searchingobj[this.selectedObject.key[0]];
                if(Object.keys(this.searchingobj).length==2){
                  this.selectedKey = undefined;
                }
                // if(text && text.trim()){
                //   this.showSpinner = true;
                //     setTimeout(()=> { 
                //     this.showSpinner = false;
                //     this._toast.error('Date Format is incorrect');
                //     }, 2000);

                //     this.inputRemovingCurrentDate = text.trim();
                //     return;
                // }
                this.fromDate = null;
                this.inputCurrentDate = null;
              }
              this.filter(this.searchingobj);
            // }
      });



      this.onDateSubscriberTwo  = fromEvent(this.dateSearchTwo && this.dateSearchTwo.nativeElement, 'keyup').pipe(
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
          // if(text != dateCasting){
              this.selectedKey = this.selectedObject.key;
                if(text && text.trim() &&  moment(text.trim()).isValid()){
                  this.searchingobj[this.selectedObject.key[1]] = moment(text.trim()).toISOString();
                }else{
                  delete this.searchingobj[this.selectedObject.key[1]];
                  if(Object.keys(this.searchingobj).length==2){
                    this.selectedKey = undefined;
                  };
                  // if(text && text.trim()){
                  //   this.showSpinner = true;
                  //     setTimeout(()=> { 
                  //     this.showSpinner = false;
                  //     this._toast.error('Date Format is incorrect');
                  //     }, 2000);
  
                  //     this.inputRemovingCurrentDate = text.trim();
                  //     return;
                  // }
                  this.toDate = null;
                  this.inputCurrentDate = null;
                }
                this.filter(this.searchingobj);
              // }
        });



}

  searchOnChange(elem){
    if(elem.value && this.selectedObject.key){
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
    this.selectedKey = undefined;
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
            if(this.selectedObject && this.selectedObject.key && !Array.isArray(this.selectedObject.key) && this.selectedKey){
              var objkeyObj ={
                [this.selectedObject.key]: obj[this.selectedKey],
              }
            }else if(this.selectedObject && this.selectedObject.key && Array.isArray(this.selectedObject.key) && Array.isArray(this.selectedKey)){
             var objkey = {}
              if(obj[this.selectedKey[0]]){
                objkey[this.selectedObject.key[0]] = obj[this.selectedKey[0]]
              }
              if(obj[this.selectedKey[1]]){
                objkey[this.selectedObject.key[1]] = obj[this.selectedKey[1]]
              }
              objkeyObj = Object.assign({},objkey);
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
  getCurrentDate(value){
    this.inputCurrentDate = value;
  }
  onlyBackSpaceAllow(event){
    if (event.key == 'Backspace') {
      if(this.fromDate || this.toDate){
        if(this.onDateSubscriberOne){
          this.onDateSubscriberOne.unsubscribe();
        }
        if(this.onDateSubscriberTwo){
          this.onDateSubscriberTwo.unsubscribe();
        }
          this.searchOnDateRemoving();
      }
      event.target.value = '';
      return;
      }
      else{
        event.preventDefault();

      }
  }
  calenderSearching(closeEvent){
    if(this.inputCurrentDate == this.fromDate && closeEvent=='fromDate'){
      return;
    }else if(this.inputCurrentDate == this.toDate && closeEvent=='toDate'){
      return;
    }
    this.selectedKey = this.selectedObject.key;
    if(this.searchingCriteria.TotalRecords){
      this.searchingobj.TotalRecords = this.searchingCriteria.TotalRecords;
    }
    if(this.searchingCriteria.PageNumber == 0){
      this.searchingobj.PageNumber = this.searchingCriteria.PageNumber;
    }

    if(this.fromDate){
      this.searchingobj[this.selectedObject.key[0]] = moment(`${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`, 'YYYY-M-D').toISOString();
    }
    if(this.toDate){
      this.searchingobj[this.selectedObject.key[1]] = moment(`${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`, 'YYYY-M-D').toISOString();
    }
    
    this.filter(this.searchingobj);
   
  }
 
}
