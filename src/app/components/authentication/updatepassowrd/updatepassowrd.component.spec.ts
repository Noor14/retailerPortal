import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepassowrdComponent } from './updatepassowrd.component';

describe('UpdatepassowrdComponent', () => {
  let component: UpdatepassowrdComponent;
  let fixture: ComponentFixture<UpdatepassowrdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatepassowrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatepassowrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
