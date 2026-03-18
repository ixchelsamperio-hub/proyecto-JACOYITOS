import { Injectable, signal } from '@angular/core';
import { ApiService } from './api';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
  rating: number;
  unit: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  products = signal<Product[]>([]);
  loading = signal(false);

  constructor(private api: ApiService) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.api.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addProduct(product: Omit<Product, 'id'>): Promise<void> {
    return new Promise(resolve => {
      this.api.createProduct(product).subscribe({
        next: (newProduct) => {
          this.products.update(list => [...list, newProduct]);
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  updateProduct(updated: Product): Promise<void> {
    return new Promise(resolve => {
      this.api.updateProduct(updated.id, updated).subscribe({
        next: (p) => {
          this.products.update(list => list.map(item => item.id === p.id ? p : item));
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  deleteProduct(id: string): Promise<void> {
    return new Promise(resolve => {
      this.api.deleteProduct(id).subscribe({
        next: () => {
          this.products.update(list => list.filter(p => p.id !== id));
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  updateStock(id: string, quantity: number): void {
    this.api.updateStock(id, quantity).subscribe({
      next: (res) => {
        this.products.update(list => list.map(p =>
          p.id === id ? { ...p, stock: res.stock } : p
        ));
      }
    });
  }

  getById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.products().map(p => p.category))];
  }
}
