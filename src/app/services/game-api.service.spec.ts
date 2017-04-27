/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GameApiService } from './game-api.service';

describe('GameApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameApiService]
    });
  });

  it('should ...', inject([GameApiService], (service: GameApiService) => {
    expect(service).toBeTruthy();
  }));
});
