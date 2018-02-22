import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SumaryanioComponent } from './sumaryanio.component';

describe('SumaryanioComponent', () => {
  let component: SumaryanioComponent;
  let fixture: ComponentFixture<SumaryanioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SumaryanioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SumaryanioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
