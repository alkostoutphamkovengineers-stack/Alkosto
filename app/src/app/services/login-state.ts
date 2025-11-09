import { Injectable, computed, signal } from '@angular/core';
import { UserBaseInfo } from '../types/register-user';

@Injectable({ providedIn: 'root' })
export class LoginState {
  public isLoggedIn = signal<boolean>(!!localStorage.getItem('🦈'));
  public userName = signal<string>(localStorage.getItem('userName') ?? '');
  public userEmail = signal<string>(localStorage.getItem('userEmail') ?? '');
  public userPhone = signal<string>(localStorage.getItem('userPhoneNumber') ?? '');
  public readonly displayName = computed(() => this.userName() || this.userEmail() || '');

  setUser(session: UserBaseInfo) {
    if (session.id !== undefined) {
      localStorage.setItem('id', String(session.id));
    }
    if (session.nombre !== undefined) {
      this.userName.set(session.nombre);
      localStorage.setItem('userName', session.nombre);
    }
    if (session.email !== undefined) {
      this.userEmail.set(session.email);
      localStorage.setItem('userEmail', session.email);
    }
    if (session.telefono !== undefined) {
      this.userPhone.set(session.telefono);
      localStorage.setItem('userPhoneNumber', session.telefono);
    }
  }

  setLoggedIn(session: UserBaseInfo) {
    localStorage.setItem('🦈', 'logged');
    this.isLoggedIn.set(true);
    if (session) this.setUser(session);
  }

  setLoggedOut() {
    localStorage.removeItem('🦈');
    localStorage.removeItem('id');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhoneNumber');
    this.userName.set('');
    this.userEmail.set('');
    this.userPhone.set('');
    this.isLoggedIn.set(false);
  }
}
