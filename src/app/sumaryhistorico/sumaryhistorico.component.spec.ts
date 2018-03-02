import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SumaryhistoricoComponent } from './sumaryhistorico.component';

describe('SumaryhistoricoComponent', () => {
  let component: SumaryhistoricoComponent;
  let fixture: ComponentFixture<SumaryhistoricoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SumaryhistoricoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SumaryhistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
