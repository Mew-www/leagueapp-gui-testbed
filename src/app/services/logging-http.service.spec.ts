import { TestBed, inject } from '@angular/core/testing';

import { LoggingHttpService } from './logging-http.service';

describe('LoggingHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingHttpService]
    });
  });

  it('should ...', inject([LoggingHttpService], (service: LoggingHttpService) => {
    expect(service).toBeTruthy();
  }));
});
