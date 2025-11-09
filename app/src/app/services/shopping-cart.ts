import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BASEURL } from '../core/http/url';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCart {
  public readonly count: WritableSignal<number> = signal(0);
  constructor(private readonly http: HttpClient) {}

  findAllProductInCart(userId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${BASEURL}/shopping-cart?userId=${userId}`, {
      headers,
    });
  }

  countProductInCart(userId: number): Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${BASEURL}/shopping-cart/count?userId=${userId}`, {
      headers,
    });
  }

  refreshCount(userId: number): void {
    this.countProductInCart(userId).subscribe({
      next: (value) => this.count.set(typeof value === 'number' ? value : 0),
      error: (err) => {
        console.error('ShoppingCart.refreshCount error', err);
      },
    });
  }

  addProduct(userId: number, productId: number, amount: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Record<string, string | number>>(
      `${BASEURL}/shopping-cart/product`,
      { userId, productId, amount },
      { headers }
    );
  }

  updateProduct(userId: number, productId: number, amount: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Record<string, string | number>>(
      `${BASEURL}/shopping-cart/product`,
      { userId, productId, amount },
      { headers }
    );
  }
  
  deleteProduct(id: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<Record<string, string | number>>(`${BASEURL}/shopping-cart/${id}`, {
      headers,
    });
  }
}
