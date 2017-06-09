import { TestBed, inject } from '@angular/core/testing';

import { ExplorerApiService } from './explorer-api.service';

describe('ExplorerApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExplorerApiService]
    });
  });

  it('should ...', inject([ExplorerApiService], (service: ExplorerApiService) => {
    expect(service).toBeTruthy();
  }));
});
