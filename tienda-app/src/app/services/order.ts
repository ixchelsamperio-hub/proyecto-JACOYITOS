import { Injectable, signal } from '@angular/core';
import { ApiService } from './api';
import { CartItem } from './cart';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pendiente' | 'en camino' | 'entregado';
  month: number;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  orders = signal<Order[]>([]);
  userOrders = signal<Order[]>([]);
  unreadCount = signal(0);

  constructor(private api: ApiService) {}

  loadAllOrders(): void {
    this.api.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.unreadCount.set(orders.filter((o: Order) => o.status === 'pendiente').length);
      }
    });
  }

  loadUserOrders(userId: string): void {
    this.api.getUserOrders(userId).subscribe({
      next: (orders) => this.userOrders.set(orders)
    });
  }

  addOrder(userId: string, userName: string, userEmail: string, items: CartItem[], total: number): Promise<Order> {
    return new Promise(resolve => {
      const orderData = { userId, userName, userEmail, items, total };
      this.api.createOrder(orderData).subscribe({
        next: (order) => {
          this.orders.update(list => [order, ...list]);
          this.userOrders.update(list => [order, ...list]);
          this.unreadCount.update(n => n + 1);
          resolve(order);
        }
      });
    });
  }

  updateStatus(orderId: string, status: Order['status']): void {
    this.api.updateOrderStatus(orderId, status).subscribe({
      next: (updated) => {
        this.orders.update(list => list.map(o => o.id === orderId ? updated : o));
        this.userOrders.update(list => list.map(o => o.id === orderId ? updated : o));
      }
    });
  }

  deleteOrder(orderId: string): void {
    this.api.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders.update(list => list.filter(o => o.id !== orderId));
        this.userOrders.update(list => list.filter(o => o.id !== orderId));
      }
    });
  }

  clearUserHistory(userId: string): void {
    this.api.clearUserHistory(userId).subscribe({
      next: () => {
        this.orders.update(list => list.filter(o => o.userId !== userId));
        this.userOrders.set([]);
      }
    });
  }

  getByUser(userId: string): Order[] {
    return this.orders().filter(o => o.userId === userId);
  }

  getSpentThisMonth(userId: string): number {
    const now = new Date();
    return this.userOrders()
      .filter(o => o.month === now.getMonth() + 1 && o.year === now.getFullYear())
      .reduce((sum, o) => sum + o.total, 0);
  }

  markAllRead(): void { this.unreadCount.set(0); }
}
