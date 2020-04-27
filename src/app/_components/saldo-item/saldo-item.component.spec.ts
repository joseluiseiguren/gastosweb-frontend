import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoItemComponent } from './saldo-item.component';

describe('SaldoItemComponent', () => {
  let component: SaldoItemComponent;
  let fixture: ComponentFixture<SaldoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
