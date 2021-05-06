import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IPlan } from 'src/app/interfaces/plan.interface';
import { CartService } from 'src/app/servicios/catalog/cart.service';

@Injectable({
    providedIn: 'root'
})
export class CartGuard implements CanActivate {
    constructor(
        private cartService: CartService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise(resolve => {
            this.cartService.cartListener$.subscribe((cart: [IPlan, string]) => {
                if (cart) {
                    resolve(true);
                } else {
                    this.router.navigateByUrl('main/plan');
                    resolve(false);
                }
            });
        });
    }
}
