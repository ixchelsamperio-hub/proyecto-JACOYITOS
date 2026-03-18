import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class Cart {
  items = signal<CartItem[]>([]);
  total = computed(() => this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0));
  count = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));

  add(product: Product): void {
    const existing = this.items().find(i => i.product.id === product.id);
    if (existing) {
      this.items.update(list => list.map(i =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      this.items.update(list => [...list, { product, quantity: 1 }]);
    }
  }

  remove(productId: string): void {
    this.items.update(list => list.filter(i => i.product.id !== productId));
  }

  updateQty(productId: string, qty: number): void {
    if (qty < 1) { this.remove(productId); return; }
    this.items.update(list => list.map(i =>
      i.product.id === productId ? { ...i, quantity: qty } : i
    ));
  }

  clear(): void { this.items.set([]); }
}
