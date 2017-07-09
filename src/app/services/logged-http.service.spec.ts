import { TestBed, inject } from '@angular/core/testing';

import { LoggedHttpService } from './logged-http.service';

describe('LoggedHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedHttpService]
    });
  });

  it('should ...', inject([LoggedHttpService], (service: LoggedHttpService) => {
    expect(service).toBeTruthy();
  }));
});
