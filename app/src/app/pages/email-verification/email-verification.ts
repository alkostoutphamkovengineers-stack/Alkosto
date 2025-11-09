import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MyAccount as MyAccountService } from '../../services/my-account';

@Component({
  selector: 'app-email-verification',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.scss',
})
export class EmailVerification {
  protected email: string = '';
  protected emailForm: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly myAccountService: MyAccountService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    const navigation = this.router.currentNavigation();
    if (navigation?.extras?.state) {
      this.email = navigation.extras.state['email'] ?? '';
      if (this.email) {
        this.emailForm.get('email')?.setValue(this.email);
      }
    }
  }

  protected onEmailInput(): void {
    const value = this.emailForm.get('email')?.value ?? '';
  }

  protected clearEmail(): void {
    this.emailForm.get('email')?.setValue('');
    this.emailForm.markAsPristine();
  }

  protected onSubmit(): void {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email')?.value;

      this.myAccountService.findUserByEmail(email).subscribe({
        next: (res) => {
          if (res) {
            localStorage.setItem('id', String(res.id)),
            localStorage.setItem('userName', res.nombre);
            localStorage.setItem('userLastName', res.apellido);
            localStorage.setItem('userEmail', res.email);
            localStorage.setItem('userPhoneNumber', res.telefono);

            this.router.navigate(['/login/options'], {
              state: { email: email, userExists: true },
            });

            return;
          }

          this.router.navigate(['/register'], {
            state: { email: email, userExists: false },
          });
        },
      });

      return;
    }
  }
}
