import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASEURL } from '../core/http/url';

@Injectable({
  providedIn: 'root',
})
export class Security {
  constructor(private readonly http: HttpClient) {}

  changePassword(email: string, newPassword: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<boolean>(
      `${BASEURL}/auth/change-password`,
      { email, newPassword },
      {
        headers,
      }
    );
  }

  login(email: string, password: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<boolean>(
      `${BASEURL}/auth/login-password`,
      { email, password },
      {
        headers,
      }
    );
  }
}
