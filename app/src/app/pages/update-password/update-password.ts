import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { LoginState } from '../../services/login-state';
import { Security } from '../../services/security';

@Component({
  selector: 'app-update-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-password.html',
  styleUrl: './update-password.scss',
})
export class UpdatePassword {
  protected passwordForm: FormGroup;
  protected submitting = signal(false);
  protected successMessage = signal<string>('');
  protected errorMessage = signal<string>('');

  constructor(
    private readonly fb: FormBuilder,
    protected readonly loginState: LoginState,
    private readonly securityService: Security
  ) {
    this.passwordForm = this.fb.group(
      {
        current: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.passwordsMatch] }
    );
  }

  private passwordsMatch(control: AbstractControl) {
    const newP = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (newP && confirm && newP !== confirm) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    const confirmCtrl = control.get('confirmPassword');
    if (confirmCtrl?.errors && confirmCtrl.errors['mismatch'] && newP === confirm) {
      const { mismatch, ...rest } = confirmCtrl.errors as any;
      confirmCtrl.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  }

  protected onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const email = this.loginState.userEmail();
    const newPassword = this.passwordForm.get('newPassword')?.value;

    this.submitting.set(true);
    this.securityService.changePassword(email, newPassword).subscribe({
      next: (res) => {
        if (res) {
          this.submitting.set(false);
          this.successMessage.set('Contraseña actualizada correctamente.');
          this.passwordForm.reset();
          return;
        }

        this.submitting.set(false);
        this.errorMessage.set('No se pudo actualizar la contraseña. Intenta más tarde.');
      },
      error: (err) => {
        console.error('change-password error', err);
        this.submitting.set(false);
        this.errorMessage.set('No se pudo actualizar la contraseña. Intenta más tarde.');
      },
    });
  }
}
