import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASEURL } from '../core/http/url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Products {
  constructor(private readonly http: HttpClient) {}

  getLikeProducts(productName: string): Observable<Products[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Products[]>(`${BASEURL}/products/search?=productName=${productName}`, {
      headers,
    });
  }
}
