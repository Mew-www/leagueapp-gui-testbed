import { TestBed, inject } from '@angular/core/testing';

import { LogHistoryService } from './log-history.service';

describe('LogHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogHistoryService]
    });
  });

  it('should ...', inject([LogHistoryService], (service: LogHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
