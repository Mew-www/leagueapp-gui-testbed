/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlayerApiService } from './player-api.service';

describe('PlayerApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerApiService]
    });
  });

  it('should ...', inject([PlayerApiService], (service: PlayerApiService) => {
    expect(service).toBeTruthy();
  }));
});
