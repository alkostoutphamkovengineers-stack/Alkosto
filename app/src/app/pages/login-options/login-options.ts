import { Component, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CodeAlert } from './components/code-alert/code-alert';
import { Login as LoginService } from '../../services/login';

@Component({
  imports: [CodeAlert, RouterLink],
  selector: 'app-login-options',
  templateUrl: './login-options.html',
  styleUrl: './login-options.scss',
})
export class LoginOptions {
  @ViewChild(CodeAlert) codeAlert!: CodeAlert;

  protected email: string = '';
  protected lastFourDigits = signal<string>('****');

  constructor(private readonly router: Router, private readonly loginService: LoginService) {
    const navigation = this.router.currentNavigation();
    if (navigation?.extras?.state) {
      this.email = navigation.extras.state['email'];
    }

    const phoneNumber = localStorage.getItem('userPhoneNumber');
    if (phoneNumber && phoneNumber.length >= 4) {
      this.lastFourDigits.set(phoneNumber.slice(-4));
    }
  }

  protected modifyEmail() {
    this.router.navigate(['/emailVerification'], {
      state: { email: this.email, userExists: false },
    });
  }

  protected openVerification(method: string): void {
    this.loginService
      .genOptCode(method, this.email, `+57${localStorage.getItem('userPhoneNumber')}` || '')
      .subscribe({
        next: (res) => {
          if (res) {
            this.codeAlert.open(method);
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
