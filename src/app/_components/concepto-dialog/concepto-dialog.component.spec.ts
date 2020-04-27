import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoDialogComponent } from './concepto-dialog.component';

describe('ConceptoDialogComponent', () => {
  let component: ConceptoDialogComponent;
  let fixture: ComponentFixture<ConceptoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
