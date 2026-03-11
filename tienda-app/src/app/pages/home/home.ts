import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product';
import { Cart } from '../../services/cart';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  productService = inject(ProductService);
  cart = inject(Cart);
  auth = inject(Auth);

  search = signal('');
  selectedCategory = signal('Todas');
  addedIds = signal<number[]>([]);

  categories = computed(() => ['Todas', ...this.productService.getCategories()]);

  filteredProducts = computed(() => {
    return this.productService.products().filter(p => {
      const matchSearch = p.name.toLowerCase().includes(this.search().toLowerCase()) ||
                          p.description.toLowerCase().includes(this.search().toLowerCase());
      const matchCat = this.selectedCategory() === 'Todas' || p.category === this.selectedCategory();
      return matchSearch && matchCat;
    });
  });

  onSearch(e: Event) { this.search.set((e.target as HTMLInputElement).value); }
  setCategory(cat: string) { this.selectedCategory.set(cat); }

  addToCart(product: any) {
    this.cart.add(product);
    this.addedIds.update(ids => [...ids, product.id]);
    setTimeout(() => this.addedIds.update(ids => ids.filter(id => id !== product.id)), 1500);
  }

  isAdded(id: number) { return this.addedIds().includes(id); }

  stars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  }

  categoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      'Frutas': '', 'Verduras': '', 'Lácteos': '',
      'Panadería': '', 'Carnes': '', 'Bebidas': '', 'Todas': ''
    };
    return icons[cat] || '';
  }
}
