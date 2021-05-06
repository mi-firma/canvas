import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPlan, ISubscription } from 'src/app/interfaces/plan.interface';
import { CartService } from 'src/app/servicios/catalog/cart.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CustomValidators from 'src/app/validators/CustomValidators';
import { PaymentService } from 'src/app/servicios/catalog/payment.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pagos',
    templateUrl: './pagos.component.html',
    styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit, OnDestroy {

    order: any;

    step = 1;

    // Selected plan
    plan: IPlan;

    // Selected payment method - TC or PSE
    paymentMethod: string;

    // Cost of chosen product
    value = 0;

    // Number of payments
    cuotas: string [] = [];

    // List of payment methods with their associated logos
    paymentMethods: any [] = [{ method: 'Tarjeta', images: [ 'logo-visa', 'logo-american', 'logo-master', 'logo-diners']}];

    // Payment form
    paymentData: FormGroup;

    paymentSubscription: Subscription;

    constructor(
        private router: Router,
        private cartService: CartService,
        private paymentService: PaymentService,
        private formBuilder: FormBuilder
    ) { 
        this.paymentData = this.formBuilder.group({
            codePackage: ['', [Validators.required]],
            codeInterval: ['', [Validators.required]],
            tdc: this.formBuilder.group({
                cardNumber: ['', [Validators.required, /*CustomValidators.validCreditCard*/]],
                cvv: ['', [Validators.required, CustomValidators.validCVC]],
                month: ['', [Validators.required, CustomValidators.validMonth]],
                year: ['', [Validators.required, CustomValidators.validYear]],
                dues: ['', [Validators.required]]
            })
        });
    }
    
    ngOnInit(): void {
        this.init();
    }

    get codePackageFormControl(): AbstractControl {
        return this.paymentData.get('codePackage');
    }

    get codeIntervalFormControl(): AbstractControl {
        return this.paymentData.get('codeInterval');
    }

    get cardNumberFormControl(): AbstractControl {
        return this.paymentData.get('tdc').get('cardNumber');
    }

    get monthFormControl(): AbstractControl {
        return this.paymentData.get('tdc').get('month');
    }

    get yearFormControl(): AbstractControl {
        return this.paymentData.get('tdc').get('year');
    }

    get cvvFormControl(): AbstractControl {
        return this.paymentData.get('tdc').get('cvv');
    }

    /**
     * Retrieves the selected plan, the user ip and details about the user
     */
    init(): void {
        this.cartService.cartListener$.subscribe(([plan, interval]: [IPlan, string]) => {
            this.plan = plan;
            
            const sub = this.plan.subscriptionsDto.find((sub: ISubscription) => sub.intervalCode === interval);

            if (sub) {
                this.value = sub.price + sub.tax;
            }

            this.codePackageFormControl.patchValue(plan.code);
            this.codeIntervalFormControl.patchValue(interval);
        });

        for (let i = 1; i <= 32; ++i) {
            this.cuotas.push(String(i));
        }

        this.paymentMethod = this.paymentMethods[0].method;
    }

    purchase(): void {
        this.paymentSubscription = this.paymentService.addOrder(this.order).subscribe((res: any) => {
            this.router.navigateByUrl('main/pago/exitoso');
        }, (_ => {
            this.router.navigateByUrl('main/pago/fallido');
        }));
    }

    continuePayment(e: Event): void {

        e.preventDefault();

        if (!this.paymentData.valid) return;

        ++this.step;

        const fechaExp = this.monthFormControl.value + '/' + this.yearFormControl.value;

        this.order = this.paymentData.value;

        this.order.tdc.cardExpiration = fechaExp;
    }

    ngOnDestroy(): void {
        if (this.paymentSubscription) {
            this.paymentSubscription.unsubscribe();
        }
    }
}
