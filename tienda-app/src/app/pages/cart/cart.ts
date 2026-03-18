import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart as CartService } from '../../services/cart';
import { Auth } from '../../services/auth';
import { OrderService } from '../../services/order';
import { ProductService } from '../../services/product';
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
  orderService = inject(OrderService);
  productService = inject(ProductService);
  ordered = signal(false);
  loading = signal(false);

  async checkout() {
    const user = this.auth.currentUser();
    if (!user) return;
    this.loading.set(true);

    // Descontar stock en MongoDB
    for (const item of this.cartService.items()) {
      this.productService.updateStock(item.product.id, item.quantity);
    }

    // Guardar pedido en MongoDB
    await this.orderService.addOrder(
      user.id,
      `${user.name} ${user.lastName || ''}`.trim(),
      user.email,
      [...this.cartService.items()],
      this.cartService.total()
    );

    this.loading.set(false);
    this.ordered.set(true);
    this.cartService.clear();
  }

  updateQty(id: string, e: Event) {
    const val = +(e.target as HTMLInputElement).value;
    this.cartService.updateQty(id, val);
  }
}
