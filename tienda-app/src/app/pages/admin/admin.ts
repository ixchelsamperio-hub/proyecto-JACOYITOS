import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { Auth, User } from '../../services/auth';
import { OrderService, Order } from '../../services/order';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink, DecimalPipe, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',

  
})
export class Admin implements OnInit {
  ps = inject(ProductService);
  auth = inject(Auth);
  orderService = inject(OrderService);
  router = inject(Router);
  sidebarOpen = signal(true);

  view = signal<'dashboard' | 'products' | 'form' | 'orders' | 'clients'>('dashboard');
  editingProduct = signal<Product | null>(null);
  deleteConfirmId = signal<string | null>(null);
  deleteOrderId = signal<string | null>(null);
  selectedClientId = signal<string | null>(null);
  clients = signal<User[]>([]);
  selectedClientOrders = signal<Order[]>([]);

  form: Omit<Product, 'id'> = {
    name: '',
    price: 0,
    description: '',
    category: '',
    stock: 0,
    image: '🍎',
    rating: 5,
    unit: 'kg',
  };
  emojis = [
    '🍎',
    '🍌',
    '🍓',
    '🥑',
    '🍅',
    '🥦',
    '🥕',
    '🥬',
    '🧅',
    '🧄',
    '🌽',
    '🥛',
    '🧀',
    '🥚',
    '🍗',
    '🥩',
    '🍞',
    '🥐',
    '🫓',
    '☕',
    '🍊',
    '🍋',
    '🍇',
    '🫐',
    '🥝',
    '🥤',
    '🧃',
    '🍕',
    '🌮',
    '🌯',
    '🧁',
    '🍰',
    '🍫',
    '🥨',
    '🥞',
    '🧇',
    '🍿',
    '🥗',
    '🍜',
    '🍝',
  ];
  imageMode: 'emoji' | 'custom' | 'photo' = 'emoji';


onPhotoUpload(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert('La imagen es muy grande. Máximo 5MB.'); return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Comprimir y redimensionar
      const canvas = document.createElement('canvas');
      const MAX = 400; // máximo 400x400 px
      let w = img.width;
      let h = img.height;

      if (w > h) {
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      } else {
        if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);

      // Calidad 0.7 = 70% — buen balance tamaño/calidad
      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      this.form.image = compressed;

      // Mostrar tamaño final
      const kb = Math.round((compressed.length * 0.75) / 1024);
      console.log(`Imagen comprimida: ${kb}KB`);
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}




  pendingOrders = computed(() =>
    this.orderService.orders().filter((o) => o.status === 'pendiente'),
  );

  ngOnInit() {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.orderService.loadAllOrders();
    this.auth.getAllClients().then((c) => this.clients.set(c));
  }

  openAdd() {
    this.form = {
      name: '',
      price: 0,
      description: '',
      category: '',
      stock: 0,
      image: '🍎',
      rating: 5,
      unit: 'kg',
    };
    this.imageMode = 'emoji';
    this.editingProduct.set(null);
    this.view.set('form');
  }

  openEdit(p: Product) {
    this.form = { ...p };
    this.imageMode = p.image?.startsWith('data:')
      ? 'photo'
      : p.image?.length > 2
        ? 'custom'
        : 'emoji';
    this.editingProduct.set(p);
    this.view.set('form');
  }

  async save() {
    if (!this.form.name || !this.form.price) return;
    if (this.editingProduct()) {
      await this.ps.updateProduct({ ...this.form, id: this.editingProduct()!.id });
    } else {
      await this.ps.addProduct(this.form);
    }
    this.view.set('products');
  }

  confirmDelete(id: string) {
    this.deleteConfirmId.set(id);
  }
  cancelDelete() {
    this.deleteConfirmId.set(null);
  }
  async doDelete() {
    await this.ps.deleteProduct(this.deleteConfirmId()!);
    this.deleteConfirmId.set(null);
  }
  confirmDeleteOrder(id: string) {
    this.deleteOrderId.set(id);
  }
  cancelDeleteOrder() {
    this.deleteOrderId.set(null);
  }
  doDeleteOrder() {
    this.orderService.deleteOrder(this.deleteOrderId()!);
    this.deleteOrderId.set(null);
  }

  updateOrderStatus(orderId: string, e: Event) {
    const status = (e.target as HTMLSelectElement).value as Order['status'];
    this.orderService.updateStatus(orderId, status);
    if (status === 'entregado') {
      const order = this.orderService.orders().find((o) => o.id === orderId);
      if (order) this.auth.triggerDeliveryAlert(`Pedido ${order.id}`);
    }
  }

  totalValue() {
    return this.ps.products().reduce((s, p) => s + p.price * p.stock, 0);
  }
  lowStockCount() {
    return this.ps.products().filter((p) => p.stock <= 5).length;
  }

  openClientOrders(clientId: string) {
    this.selectedClientId.set(clientId);
    this.selectedClientOrders.set(this.orderService.getByUser(clientId));
    this.view.set('clients');
  }

  statusColor(s: string) {
    const m: Record<string, string> = {
      pendiente: 'warning',
      'en camino': 'info',
      entregado: 'success',
    };
    return m[s] || 'secondary';
  }

  goToOrders() {
    this.orderService.markAllRead();
    this.view.set('orders');
  }
  getLastName(user: any): string {
    return user?.lastName || '';
  }
  getClientOrders(clientId: string): Order[] {
    return this.orderService.getByUser(clientId);
  }
  getClientTotal(clientId: string): number {
    return this.getClientOrders(clientId).reduce((s, o) => s + o.total, 0);
  }
}
