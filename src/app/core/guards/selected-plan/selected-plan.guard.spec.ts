import { TestBed, async, inject } from '@angular/core/testing';

import { SelectedPlanGuard } from './selected-plan.guard';

describe('SelectedPlanGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedPlanGuard]
    });
  });

  it('should ...', inject([SelectedPlanGuard], (guard: SelectedPlanGuard) => {
    expect(guard).toBeTruthy();
  }));
});
