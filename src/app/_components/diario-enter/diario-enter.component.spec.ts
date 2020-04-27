import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioEnterComponent } from './diario-enter.component';

describe('DiarioEnterComponent', () => {
  let component: DiarioEnterComponent;
  let fixture: ComponentFixture<DiarioEnterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiarioEnterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarioEnterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
