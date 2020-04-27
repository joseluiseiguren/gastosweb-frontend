import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoAbiertoComponent } from './saldo-abierto.component';

describe('SaldoAbiertoComponent', () => {
  let component: SaldoAbiertoComponent;
  let fixture: ComponentFixture<SaldoAbiertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoAbiertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoAbiertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
