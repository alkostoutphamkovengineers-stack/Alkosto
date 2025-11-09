import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login as LoginService } from '../../../../services/login';
import { LoginState } from '../../../../services/login-state';
import { Router } from '@angular/router';
@Component({
  selector: 'app-code-alert',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './code-alert.html',
  styleUrl: './code-alert.scss',
})
export class CodeAlert {
  protected isOpen = signal<boolean>(false);
  protected verificationMethod = signal<string>('');
  protected messageVerification = signal<string>('');
  protected userAuthMethodAddress = signal<string>('');
  protected codeForm: FormGroup;
  protected countdown = signal<number>(0);
  protected verificationError = signal<string>('');
  private countdownInterval: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly loginService: LoginService,
    private readonly loginState: LoginState,
    private readonly router: Router
  ) {
    this.codeForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });
  }

  public open(method: string): void {
    this.verificationMethod.set(method);
    this.messageVerification.set(method === 'email' ? 'correo' : 'número de celular');
    this.userAuthMethodAddress.set(
      method === 'email'
        ? localStorage.getItem('userEmail') || ''
        : `+57${(localStorage.getItem('userPhoneNumber') || '')
            .split('')
            .map((char, idx) => (idx === 3 || idx === 4 || idx === 5 ? '*' : char))
            .join('')}`
    );

    this.isOpen.set(true);
    this.startCountdown();
    this.codeForm.reset();
    this.verificationError.set('');
  }

  protected close(): void {
    this.isOpen.set(false);
    this.stopCountdown();
  }

  protected onDigitInput(event: Event, currentIndex: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && /^[0-9]$/.test(value)) {
      if (currentIndex < 6) {
        const nextInput = document.querySelector(
          `input[formControlName="digit${currentIndex + 1}"]`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  protected onDigitKeydown(event: KeyboardEvent, currentIndex: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && currentIndex > 1) {
      const prevInput = document.querySelector(
        `input[formControlName="digit${currentIndex - 1}"]`
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  protected onSubmit(): void {
    if (this.codeForm.valid) {
      const code = Object.values(this.codeForm.value).join('');
      this.loginService
        .validateOptCode(code, this.verificationMethod(), localStorage.getItem('userEmail') || '')
        .subscribe({
          next: (res) => {
            if (res) {
              this.loginState.setLoggedIn({
                id: Number(localStorage.getItem('id')) || 0,
                nombre: localStorage.getItem('userName') || '',
                email: localStorage.getItem('userEmail') || '',
                telefono: localStorage.getItem('userPhoneNumber') || '',
                apellido: '',
              });
              this.verificationError.set('');
              this.close();
              this.router.navigate(['/']);
              return;
            }
            this.verificationError.set('Código inválido. Verifica e intenta de nuevo.');
            this.codeForm.markAllAsTouched();
            const first = document.querySelector(
              'input[formControlName="digit1"]'
            ) as HTMLInputElement;
            if (first) first.focus();
          },
          error: (err) => {
            console.error(err);
            this.verificationError.set('Error al verificar el código. Intenta más tarde.');
          },
        });
    } else {
      this.codeForm.markAllAsTouched();
    }
  }

  protected resendCode(): void {
    this.loginService
      .genOptCode(
        this.verificationMethod(),
        localStorage.getItem('userEmail') || '',
        `+57${localStorage.getItem('userPhoneNumber') || ''}`
      )
      .subscribe({
        next: (res) => {
          this.startCountdown();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  protected changeMethod(): void {
    this.close();
  }

  private startCountdown(): void {
    this.countdown.set(60);
    this.stopCountdown();

    this.countdownInterval = setInterval(() => {
      const current = this.countdown();
      if (current > 0) {
        this.countdown.set(current - 1);
      } else {
        this.stopCountdown();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  protected get canResend(): boolean {
    return this.countdown() === 0;
  }

  protected get hasError(): boolean {
    return this.codeForm.invalid && this.codeForm.touched;
  }
}
