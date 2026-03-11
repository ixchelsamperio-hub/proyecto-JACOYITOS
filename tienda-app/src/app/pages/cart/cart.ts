import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Cart as CartService } from '../../services/cart';
import { Auth } from '../../services/auth';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  cartService = inject(CartService);
  auth = inject(Auth);
  router = inject(Router);
  ordered = signal(false);

  checkout() {
    this.ordered.set(true);
    this.cartService.clear();
  }

  updateQty(id: number, e: Event) {
    const val = +(e.target as HTMLInputElement).value;
    this.cartService.updateQty(id, val);
  }
}
