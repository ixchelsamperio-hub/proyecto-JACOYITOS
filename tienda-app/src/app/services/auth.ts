import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private users: User[] = [
    {
      id: 1,
      name: 'Administrador',
      email: 'admin@tienda.com',
      password: 'admin123',
      role: 'admin',
    },
    { id: 2, name: 'Carlos López', email: 'carlos@mail.com', password: 'user123', role: 'client' },
    { id: 3, name: 'Ana García', email: 'ana@mail.com', password: 'user123', role: 'client' },
  ];

  currentUser = signal<User | null>(null);

  login(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (user) {
      this.currentUser.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
  }
  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
