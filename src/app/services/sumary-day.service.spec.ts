import { TestBed, inject } from '@angular/core/testing';

import { SumaryDayService } from './sumary-day.service';

describe('SumaryDayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SumaryDayService]
    });
  });

  it('should be created', inject([SumaryDayService], (service: SumaryDayService) => {
    expect(service).toBeTruthy();
  }));
});
