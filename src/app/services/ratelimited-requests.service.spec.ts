import { TestBed, inject } from '@angular/core/testing';

import { RatelimitedRequestsService } from './ratelimited-requests.service';

describe('RatelimitedRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RatelimitedRequestsService]
    });
  });

  it('should ...', inject([RatelimitedRequestsService], (service: RatelimitedRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
