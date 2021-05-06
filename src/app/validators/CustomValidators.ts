import { AbstractControl, ControlContainer } from '@angular/forms';
import * as CreditCard from 'creditcards';

export function onlyNumbers(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && control.value.length !== 0 && !/^\d+$/.test(control.value)) {
        return { 'numeric': true };
    }
    return null;
}

export function validCreditCard(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && control.value.length !== 0 && !CreditCard.card.isValid(CreditCard.card.parse(control.value))) {
        return { 'invalid-card': true };
    }
    return null;
}

export function validMonth(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && control.value.length !== 0 && !CreditCard.expiration.month.isValid(+control.value)) {
        return { 'invalid-month': true };
    }
    return null;
}

export function validYear(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && control.value.length !== 0 && !CreditCard.expiration.year.isValid(+control.value)) {
        return { 'invalid-year': true };
    }
    return null;
}

export function validCVC(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && control.value.length !== 0 && !CreditCard.cvc.isValid(control.value)) {
        return { 'invalid-cvc': true };
    }
    return null;
}

export function validAtLestOneUpperCase(control: AbstractControl): { [key: string]: boolean} | null {
    if (control.value !== undefined && control.value.length !== 0 && !/^(?=.*[A-Z]).*$/.test(control.value)){
        return { 'uppercase': true };
    }
    return null;
}

export function validAtLestOneLowerCase(control: AbstractControl): { [key: string]: boolean} | null {
    if (control.value !== undefined && control.value.length !== 0 && !/^(?=.*[a-z]).*$/.test(control.value)){
        return { 'lowercase': true };
    }
    return null;
}

export function validAtLestOneNumber(control: AbstractControl): { [key: string]: boolean} | null {
    if (control.value !== undefined && control.value.length !== 0 && !/^(?=.*[0-9]).*$/.test(control.value)){
        return { 'atLeastOneNumber': true };
    }
    return null;
}

export function validSpecialCharacter(control: AbstractControl): { [key: string]: boolean} | null {
    if (control.value !== undefined && control.value.length !== 0 && !/[^A-Za-z0-9]/.test(control.value)){
        return { 'specialCharacter': true };
    }
    return null;
}

export function validSpacesCharacter(control: AbstractControl): { [key: string]: boolean} | null {
    if (control.value !== undefined && control.value.length !== 0 && control.value.indexOf(' ') >= 0){
        return { 'spaceCharacter': true };
    }
    return null;
}

export function validSlashCharacter(control: AbstractControl): { [key: string]: boolean} | null {
    if (control.value !== undefined && control.value.length !== 0 && control.value.indexOf('/') >= 0){
        return { 'slashCharacter': true };
    }
    return null;
}

export function validPlusCharacter(control: AbstractControl): { [key: string]: boolean} | null {
    if (control.value !== undefined && control.value.length !== 0 && control.value.indexOf('+') >= 0){
        return { 'plusCharacter': true };
    }
    return null;
}