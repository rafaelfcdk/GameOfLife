import { TestBed } from '@angular/core/testing';

import { GameserveService } from './gameserve.service';

describe('GameserveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameserveService = TestBed.get(GameserveService);
    expect(service).toBeTruthy();
  });
});
