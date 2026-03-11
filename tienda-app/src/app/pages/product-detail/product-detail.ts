import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Cart } from '../../services/cart';
import { Auth } from '../../services/auth';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail {
  ps = inject(ProductService);
  cart = inject(Cart);
  auth = inject(Auth);
  route = inject(ActivatedRoute);

  added = signal(false);

  product = computed(() => {
    const id = +this.route.snapshot.params['id'];
    return this.ps.getById(id);
  });

  addToCart() {
    if (this.product()) {
      this.cart.add(this.product()!);
      this.added.set(true);
      setTimeout(() => this.added.set(false), 1500);
    }
  }

  stars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  }
}
