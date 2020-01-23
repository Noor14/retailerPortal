import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpassowrdComponent } from './forgetpassowrd.component';

describe('ForgetpassowrdComponent', () => {
  let component: ForgetpassowrdComponent;
  let fixture: ComponentFixture<ForgetpassowrdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetpassowrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetpassowrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
