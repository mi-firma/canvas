import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CreditCard from 'creditcards';
import * as CustomValidators from 'src/app/validators/CustomValidators';
import { TarjetaCredito } from 'src/app/modelos/tarjetacredito.model';
import { PagosService } from 'src/app/servicios/pagos.service';
import { PSE } from 'src/app/modelos/pse.model';

@Component({
    selector: 'app-info-pago',
    templateUrl: './info-pago.component.html',
    styleUrls: ['./info-pago.component.css']
})
export class InfoPagoComponent implements OnInit {
    @Input() showPSE: boolean;

    // Event emmitter that triggers when the continue button is clicked
    @Output() nextStep = new EventEmitter<any>();

    // List of payment methods with their associated logos
    paymentMethods: any;

    // Credit card form
    datos = new FormGroup({
        tarjeta: new FormControl('', [Validators.required, CustomValidators.validCreditCard]),
        month: new FormControl('', [Validators.required, CustomValidators.validMonth]),
        year: new FormControl('', [Validators.required, CustomValidators.validYear]),
        cvc: new FormControl('', [Validators.required, CustomValidators.validCVC]),
        cuotas: new FormControl('', [Validators.required]),
        guardarTarjeta: new FormControl(true)
    });

    // PSE card form
    pse = new FormGroup({
        Banco: new FormControl('', Validators.required),
        Persona: new FormControl('', Validators.required)
    });

    // List of payment methods
    metodos: string[] = ['Tarjeta de Crédito', 'PSE'];

    // List of options for PSE payments
    personas: any = [{ name: 'Persona Natural', ID: 'N' }, { name: 'Persona Juridica', ID: 'J' }];

    // List of possible payments
    cuotas: Array<number> = [];

    // List of banks
    bancos: any[];

    // Current selected payment method
    medioPago = 'Tarjeta de Crédito';

    constructor(
        public router: Router,
        private pagosService: PagosService,
    ) { }

    ngOnInit(): void {
        this.init();
    }

    // Returns the credit card number form control
    get tarjeta() {
        return this.datos.get('tarjeta');
    }

    // Returns the month form control
    get month() {
        return this.datos.get('month');
    }

    // Returns the year form control
    get year() {
        return this.datos.get('year');
    }

    // Returns the cvc form control
    get cvc() {
        return this.datos.get('cvc');
    }

    /**
     * Initialize the variables of this component
     */
    init(): void {
        this.pagosService.getBancos().subscribe((response: any) => {
            if (response.bancos) {
                this.bancos = response.bancos;
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
        }, (error: any) => {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        });

        for (let i = 1; i <= 32; ++i) {
            this.cuotas.push(i);
        }

        if (this.showPSE) {
            this.paymentMethods = [
                { method: 'Tarjeta de Crédito', images: [
                'logo-visa',
                'logo-american',
                'logo-master',
                'logo-diners'
            ] },
                { method: 'PSE', images: ['logo-PSE'] }
            ];
        } else {
            this.paymentMethods = [
                { method: 'Tarjeta de Crédito', images: [
                'logo-visa',
                'logo-american',
                'logo-master', 
                'logo-diners'
            ]},
            ];
        }
    }

    /**
     * Saves all the data associated with the payment form - Credit card payment only
     * @param formulario Payment form
     */
    guardar(formulario: any): void {
        if (formulario.month.length === 1) {
            formulario.month = '0' + formulario.month;
        }

        let franquicia = CreditCard.card.type(CreditCard.card.parse(formulario.tarjeta));
        const fechaExp = formulario.month + '/' + CreditCard.expiration.year.parse(formulario.year, true);
        const numeroTarjeta = CreditCard.card.parse(formulario.tarjeta);
        const cvc = formulario.cvc;

        switch (franquicia) {
            case 'Visa': {
                franquicia = 'VISA';
                break;
            }
            case 'American Express': {
                franquicia = 'AmEx';
                break;
            }
            case 'Mastercard': {
                franquicia = 'MasterCard';
                break;
            }
            case 'Diners Club': {
                franquicia = 'DinersClub';
                break;
            }
        }

        const tarjetaCredito = new TarjetaCredito('', franquicia, fechaExp, numeroTarjeta, cvc);

        const data = {
            tipo: 'TC',
            step: 2,
            tarjeta: tarjetaCredito,
            cuotas: formulario.cuotas,
            guardarTC: formulario.guardarTarjeta
        };
        this.nextStep.emit(data);
    }

    /**
     * Saves all the data associated with the payment form - PSE payment only
     * @param formulario Payment form
     */
    guardarPSE(formulario: any) {
        const data = {
            tipo: 'PSE',
            step: 2,
            pse: new PSE(formulario.Banco, formulario.Persona)
        };
        this.nextStep.emit(data);
    }
}
