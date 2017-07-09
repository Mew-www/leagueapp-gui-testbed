import { TestBed, inject } from '@angular/core/testing';

import { GameMetadataService } from './game-metadata.service';

describe('GameMetadataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameMetadataService]
    });
  });

  it('should ...', inject([GameMetadataService], (service: GameMetadataService) => {
    expect(service).toBeTruthy();
  }));
});
