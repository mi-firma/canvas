import { TestBed, async, inject } from '@angular/core/testing';

import { RegistroInitGuard } from './registro-init.guard';

describe('RegistroInitGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RegistroInitGuard]
        });
    });

    it('should ...', inject([RegistroInitGuard], (guard: RegistroInitGuard) => {
        expect(guard).toBeTruthy();
    }));
});
