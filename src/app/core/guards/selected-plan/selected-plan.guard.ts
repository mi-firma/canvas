import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { IPlan } from 'src/app/interfaces/plan.interface';

@Injectable({
    providedIn: 'root'
})
export class SelectedPlanGuard implements CanActivate {
    constructor(
        private fdService: FiledataService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise(resolve => {
            this.fdService.planListener$.subscribe((plan: IPlan) => {
                if (plan) {
                    resolve(true);
                } else {
                    this.router.navigateByUrl('main/plan');
                    resolve(false);
                }
            });
        });
    }
}
