import { TestBed, inject } from '@angular/core/testing';

import { SumaryMonthService } from './sumary-month.service';

describe('SumaryMonthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SumaryMonthService]
    });
  });

  it('should be created', inject([SumaryMonthService], (service: SumaryMonthService) => {
    expect(service).toBeTruthy();
  }));
});
