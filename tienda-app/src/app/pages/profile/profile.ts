import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { OrderService } from '../../services/order';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  auth = inject(Auth);
  orderService = inject(OrderService);
  router = inject(Router);

  activeTab = signal<'orders' | 'edit'>('orders');
  editSuccess = signal(false);
  confirmClear = signal(false);

  editForm = {
    name: this.auth.currentUser()?.name || '',
    lastName: this.auth.currentUser()?.lastName || '',
    phone: this.auth.currentUser()?.phone || '',
    address: this.auth.currentUser()?.address || '',
  };

  myOrders = computed(() => this.orderService.userOrders());
  spentThisMonth = computed(() => this.orderService.getSpentThisMonth(this.auth.currentUser()?.id || ''));
  totalSpent = computed(() => this.myOrders().reduce((s, o) => s + o.total, 0));

  ngOnInit() {
    if (!this.auth.isLoggedIn() || this.auth.isAdmin()) {
      this.router.navigate(['/']); return;
    }
    this.orderService.loadUserOrders(this.auth.currentUser()!.id);
  }

  async saveProfile() {
    await this.auth.updateProfile(this.editForm);
    this.editSuccess.set(true);
    setTimeout(() => this.editSuccess.set(false), 2500);
    this.activeTab.set('orders');
  }

  clearHistory() {
    this.orderService.clearUserHistory(this.auth.currentUser()!.id);
    this.confirmClear.set(false);
  }

  statusColor(status: string): string {
    const map: Record<string, string> = { 'pendiente': 'warning', 'en camino': 'info', 'entregado': 'success' };
    return map[status] || 'secondary';
  }

  statusIcon(status: string): string {
    const map: Record<string, string> = { 'pendiente': '🕐', 'en camino': '🚚', 'entregado': '✅' };
    return map[status] || '📦';
  }

  getFullName(): string { return this.auth.getFullName(); }
}
