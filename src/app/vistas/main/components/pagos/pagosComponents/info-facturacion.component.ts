import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IAddress } from 'src/app/interfaces/address.interface';
import { SessionService } from 'src/app/servicios';
import { AddressService } from 'src/app/servicios/address.service';

@Component({
    selector: 'app-info-facturacion',
    templateUrl: './info-facturacion.component.html',
    styleUrls: ['./info-facturacion.component.css']
})
export class InfoFacturacionComponent implements OnInit, OnDestroy {

    @Output() nextStep = new EventEmitter<any>();

    isEditing: boolean;

    addresses: IAddress [];

    addressesForm: FormGroup;

    addressesSubscription: Subscription;
    createAddressSubscription: Subscription;
    setDefaultAddressSubscription: Subscription;

    constructor(
        private addressService: AddressService,
        private sessionService: SessionService,
        private formBuilder: FormBuilder
    ) { 
        this.addressesForm = this.formBuilder.group({
            alias: ['', [Validators.required, Validators.maxLength(100)]],
            address1: ['', [Validators.required, Validators.maxLength(100)]],
            address2: [''],
            phone: [this.sessionService.phoneUser2],
            city: ['', [Validators.required, Validators.maxLength(100)]],
            departament: ['', Validators.required, Validators.maxLength(100)],
            country: ['', [Validators.required, Validators.maxLength(100)]],
            isDefault: [false]
        });
    }

    ngOnInit(): void {
       this.retrieveAddresses(); 
    }

    retrieveAddresses(): void {
        this.addressesSubscription = this.addressService.getAll().subscribe((addresses: IAddress[]) => {
            this.addresses = addresses;

            this.isEditing = this.addresses.length <= 0;
        });
    }

    toggleEditAddress(): void {
        this.isEditing = !this.isEditing;
    }

    createAddress(event: Event): void {

        event.preventDefault();

        if (this.addressesForm.invalid) return;

        this.createAddressSubscription = this.addressService.create(this.addressesForm.value).subscribe((_ => {
            this.isEditing = false;
            this.retrieveAddresses();
        }));
    }

    setPreferredAddress(address: IAddress): void {
        this.setDefaultAddressSubscription = this.addressService.setDefault(address.idAddress).subscribe((_) => {
            this.retrieveAddresses();
        });
    }

    ngOnDestroy(): void {
        if (this.addressesSubscription) {
            this.addressesSubscription.unsubscribe();
        }

        if (this.createAddressSubscription) {
            this.createAddressSubscription.unsubscribe();
        }

        if (this.setDefaultAddressSubscription) {
            this.setDefaultAddressSubscription.unsubscribe();
        }
    }
}
