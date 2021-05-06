import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPlan } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private cart = new BehaviorSubject<[IPlan, string]>(null);
  
  cartListener$ = this.cart.asObservable();

  constructor() { }

  addItem(plan: IPlan, intervalCode: string): void {
    this.cart.next([plan, intervalCode]);
  }

  clearCart(): void {
    this.cart.next(null);
  }
}
