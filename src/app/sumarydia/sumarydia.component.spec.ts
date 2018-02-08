import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SumarydiaComponent } from './sumarydia.component';

describe('SumarydiaComponent', () => {
  let component: SumarydiaComponent;
  let fixture: ComponentFixture<SumarydiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SumarydiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SumarydiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
