import { TestBed } from '@angular/core/testing';

import { ReconoserService } from './reconoser.service';

describe('ReconoserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReconoserService = TestBed.get(ReconoserService);
    expect(service).toBeTruthy();
  });
});
