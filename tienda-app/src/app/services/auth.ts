import { Injectable, signal } from '@angular/core';
import { ApiService } from './api';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: 'admin' | 'client';
  phone?: string;
  address?: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  currentUser = signal<User | null>(null);
  deliveryAlert = signal<string | null>(null);

  constructor(private api: ApiService, private router: Router) {
    // Restaurar sesión del localStorage
    const saved = localStorage.getItem('user');
    if (saved) this.currentUser.set(JSON.parse(saved));
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise(resolve => {
      this.api.login(email, password).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
          resolve(true);
        },
        error: () => resolve(false)
      });
    });
  }

  register(data: any): Promise<{ ok: boolean; error?: string }> {
    return new Promise(resolve => {
      this.api.register(data).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
          resolve({ ok: true });
        },
        error: (err) => resolve({ ok: false, error: err.error?.error || 'Error al registrarse' })
      });
    });
  }

  updateProfile(data: Partial<User>): Promise<void> {
    return new Promise(resolve => {
      const user = this.currentUser();
      if (!user) return resolve();
      this.api.updateProfile(user.id, data).subscribe({
        next: (updated) => {
          this.currentUser.set(updated);
          localStorage.setItem('user', JSON.stringify(updated));
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  triggerDeliveryAlert(orderName: string): void {
    this.deliveryAlert.set(orderName);
    setTimeout(() => this.deliveryAlert.set(null), 5000);
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAdmin(): boolean { return this.currentUser()?.role === 'admin'; }
  isLoggedIn(): boolean { return this.currentUser() !== null; }

  getAllClients(): Promise<User[]> {
    return new Promise(resolve => {
      this.api.getClients().subscribe({
        next: (clients) => resolve(clients),
        error: () => resolve([])
      });
    });
  }

  getFullName(): string {
    const u = this.currentUser();
    return u ? `${u.name} ${u.lastName || ''}`.trim() : '';
  }

  getLastName(user: any): string { return user?.lastName || ''; }
}
