import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { Auth } from '../../services/auth';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  ps = inject(ProductService);
  auth = inject(Auth);
  router = inject(Router);

  view = signal<'dashboard' | 'products' | 'form'>('dashboard');
  editingProduct = signal<Product | null>(null);
  deleteConfirmId = signal<number | null>(null);

  form: Omit<Product, 'id'> = { name: '', price: 0, description: '', category: '', stock: 0, image: '🍎', rating: 5, unit: 'kg' };

  emojis = ['🍎', '🍌', '🍓', '🥑', '🍅', '🥦', '🥕', '🥬', '🧅', '🧄', '🌽', '🥛', '🧀', '🥚', '🍗', '🥩', '🍞', '🥐', '🫓', '☕', '🍊', '🍋', '🍇', '🫐', '🥝'];

  ngOnInit() {
    if (!this.auth.isAdmin()) this.router.navigate(['/']);
  }

  openAdd() {
    this.form = { name: '', price: 0, description: '', category: '', stock: 0, image: '🍎', rating: 5, unit: 'kg' };
    this.editingProduct.set(null); this.view.set('form');
  }

  openEdit(p: Product) {
    this.form = { ...p }; this.editingProduct.set(p); this.view.set('form');
  }

  save() {
    if (!this.form.name || !this.form.price) return;
    if (this.editingProduct()) {
      this.ps.updateProduct({ ...this.form, id: this.editingProduct()!.id });
    } else {
      this.ps.addProduct(this.form);
    }
    this.view.set('products');
  }

  confirmDelete(id: number) { this.deleteConfirmId.set(id); }
  cancelDelete() { this.deleteConfirmId.set(null); }
  doDelete() { this.ps.deleteProduct(this.deleteConfirmId()!); this.deleteConfirmId.set(null); }
  totalValue() { return this.ps.products().reduce((s, p) => s + p.price * p.stock, 0); }
  lowStockCount() { return this.ps.products().filter(p => p.stock <= 5).length; }
}
