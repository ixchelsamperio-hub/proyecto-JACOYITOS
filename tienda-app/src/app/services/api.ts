import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // AUTH
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/auth/login`, { email, password });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.base}/auth/register`, data);
  }

  updateProfile(userId: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/auth/profile/${userId}`, data, { headers: this.headers() });
  }

  getClients(): Observable<any> {
    return this.http.get(`${this.base}/auth/clients`, { headers: this.headers() });
  }

  // PRODUCTS
  getProducts(): Observable<any> {
    return this.http.get(`${this.base}/products/`);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.base}/products/`, data, { headers: this.headers() });
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/products/${id}`, data, { headers: this.headers() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.base}/products/${id}`, { headers: this.headers() });
  }

  updateStock(id: string, quantity: number): Observable<any> {
    return this.http.patch(`${this.base}/products/${id}/stock`, { quantity }, { headers: this.headers() });
  }

  // ORDERS
  getOrders(): Observable<any> {
    return this.http.get(`${this.base}/orders/`, { headers: this.headers() });
  }

  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${this.base}/orders/user/${userId}`, { headers: this.headers() });
  }

  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.base}/orders/`, data, { headers: this.headers() });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.base}/orders/${orderId}/status`, { status }, { headers: this.headers() });
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.base}/orders/${orderId}`, { headers: this.headers() });
  }

  clearUserHistory(userId: string): Observable<any> {
    return this.http.delete(`${this.base}/orders/user/${userId}`, { headers: this.headers() });
  }

  getMonthlySpent(userId: string): Observable<any> {
    return this.http.get(`${this.base}/orders/user/${userId}/monthly`, { headers: this.headers() });
  }
}
