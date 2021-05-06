import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/servicios';

@Injectable({
    providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {
    constructor(
        private sessionService: SessionService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.sessionService.isPinAllowed)
        {
            this.router.navigate(['login/reset/password/pin']);
            return false;              
        }
        localStorage.removeItem('pinAllowed');
        return true;
    }
}
