import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserBaseInfo } from '../types/register-user';

import { BASEURL } from '../core/http/url';

@Injectable({
  providedIn: 'root',
})
export class Register {
  constructor(private readonly http: HttpClient) {}

  UserBaseInfo(user: UserBaseInfo) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserBaseInfo>(`${BASEURL}/users/register`, user, {
      headers,
    });
  }
}
