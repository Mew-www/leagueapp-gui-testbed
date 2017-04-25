/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaticApiService } from './static-api.service';

describe('StaticApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticApiService]
    });
  });

  it('should ...', inject([StaticApiService], (service: StaticApiService) => {
    expect(service).toBeTruthy();
  }));
});
