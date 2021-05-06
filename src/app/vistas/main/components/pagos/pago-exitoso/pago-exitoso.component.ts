import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPlan, ISubscription } from 'src/app/interfaces/plan.interface';
import { CartService } from 'src/app/servicios/catalog/cart.service';

@Component({
    selector: 'app-pago-exitoso',
    templateUrl: './pago-exitoso.component.html',
    styleUrls: ['./pago-exitoso.component.css']
})
export class PagoExitosoComponent implements OnInit {

    plan: IPlan;
    value: number;

    cartSubscription: Subscription;

    constructor(
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.cartSubscription = this.cartService.cartListener$.subscribe(([plan, interval]: [IPlan, string]) => {
            this.plan = plan;

            const sub = this.plan.subscriptionsDto.find((sub: ISubscription) => sub.intervalCode === interval);

            if (sub) {
                this.value = sub.price + sub.tax;
            }
        });
    }

    ngOnDestroy(): void {
        if (this.cartSubscription) {
            this.cartSubscription.unsubscribe();
        }
        this.cartService.clearCart();
    }
}
