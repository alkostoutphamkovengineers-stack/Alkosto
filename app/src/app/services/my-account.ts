import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASEURL } from '../core/http/url';
import { UserBaseInfo } from '../types/register-user';

@Injectable({
  providedIn: 'root',
})
export class MyAccount {
  constructor(private readonly http: HttpClient) {}

  findUserByEmail(email: string): Observable<UserBaseInfo> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<UserBaseInfo>(`${BASEURL}/users/validate-user-email?email=${email}`, {
      headers,
    });
  }
}
