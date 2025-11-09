import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginState } from '../../services/login-state';
import { Security } from '../../services/security';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected passwordForm: FormGroup;
  protected submitting = signal(false);
  protected errorMessage = signal('');
  protected email: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly loginState: LoginState,
    private readonly security: Security
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]],
    });

    const nav = this.router.currentNavigation?.();
    this.email =
      (nav && nav.extras && (nav.extras as any).state?.email) ||
      localStorage.getItem('userEmail') ||
      loginState.userEmail();
  }

  protected modifyEmail() {
    this.router.navigate(['/emailVerification'], {
      state: { email: this.email, userExists: false },
    });
  }

  protected changeMethod() {
    this.router.navigate(['/login/options'], {
      state: { email: this.email, userExists: false },
    });
  }

  protected onSubmit(): void {
    this.errorMessage.set('');
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const password = this.passwordForm.get('password')?.value;
    this.submitting.set(true);
    this.security.login(this.loginState.userEmail(), password).subscribe({
      next: (res) => {
        if (res) {
          this.loginState.setLoggedIn({
            id: Number(localStorage.getItem('id')) || 0,
            nombre: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
            telefono: localStorage.getItem('userPhoneNumber') || '',
            apellido: '',
          });
          this.router.navigate(['/']);
          return;
        }
        this.submitting.set(false);
        this.passwordForm.get('password')?.setErrors({ invalidCredentials: true });
        this.errorMessage.set('La contraseña no es válida. Verifica e intenta de nuevo.');
      },
      error: (err) => {
        console.error(err);
        this.submitting.set(false);
        this.errorMessage.set('Ocurrió un error al iniciar sesión. Intenta de nuevo más tarde.');
      },
    });
  }
}
