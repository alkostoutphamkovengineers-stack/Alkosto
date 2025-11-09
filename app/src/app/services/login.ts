import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASEURL } from '../core/http/url';

@Injectable({
  providedIn: 'root',
})
export class Login {
  constructor(private readonly http: HttpClient) {}

  genOptCode(method: string, email: string, phoneNumber: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<boolean>(
      `${BASEURL}/auth/generate-opt-code`,
      { method, email, phoneNumber },
      {
        headers,
      }
    );
  }

  validateOptCode(optCode: string, method: string, email: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<boolean>(
      `${BASEURL}/auth/valid-opt-code?email=${email}&optCode=${optCode}&method=${method}`,
      {
        headers,
      }
    );
  }
}
