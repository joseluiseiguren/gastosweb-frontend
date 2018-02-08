import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SumarymesComponent } from './sumarymes.component';

describe('SumarymesComponent', () => {
  let component: SumarymesComponent;
  let fixture: ComponentFixture<SumarymesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SumarymesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SumarymesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
