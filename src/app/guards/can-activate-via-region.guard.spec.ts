import { TestBed, async, inject } from '@angular/core/testing';

import { CanActivateViaRegionGuard } from './can-activate-via-region.guard';

describe('CanActivateViaRegionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateViaRegionGuard]
    });
  });

  it('should ...', inject([CanActivateViaRegionGuard], (guard: CanActivateViaRegionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
