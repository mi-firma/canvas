import { TestBed, async, inject } from '@angular/core/testing';

import { NoFilesGuard } from './no-files.guard';

describe('NoFilesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoFilesGuard]
    });
  });

  it('should ...', inject([NoFilesGuard], (guard: NoFilesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
