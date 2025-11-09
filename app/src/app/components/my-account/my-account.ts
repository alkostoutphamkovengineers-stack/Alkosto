import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, signal, effect } from '@angular/core';
import { LoginState } from '../../services/login-state';
import { Router, RouterLink } from '@angular/router';

import { MyAccount as MyAccountService } from '../../services/my-account';

@Component({
  selector: 'app-my-account',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './my-account.html',
  styleUrl: './my-account.scss',
})
export class MyAccount {
  protected emailForm: FormGroup;
  protected stateMenu: boolean = false;
  protected emailTouched = signal<boolean>(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly myAccountService: MyAccountService,
    protected readonly loginState: LoginState
  ) {
    this.emailForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    effect(() => {
      const emailControl = this.emailForm.get('email');
      const value = emailControl?.value;

      if (emailControl && (value?.length > 0 || emailControl.touched)) {
        this.emailTouched.set(true);
      }
    });
  }

  protected formError(): boolean {
    const emailControl = this.emailForm.get('email');
    return !!(
      emailControl &&
      emailControl.invalid &&
      this.emailTouched() &&
      !emailControl.pristine
    );
  }

  protected onEmailFocus(): void {
    this.emailTouched.set(true);
  }

  protected onEmailBlur(): void {
    const emailControl = this.emailForm.get('email');
    if (emailControl && emailControl.value.length === 0) {
      this.emailTouched.set(false);
    }
  }

  protected openOrCloseMenu(): void {
    this.stateMenu = !this.stateMenu;
  }

  protected onSubmit(): void {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email')?.value;

      this.myAccountService.findUserByEmail(email).subscribe({
        next: (res) => {
          if (res) {
            this.loginState.setUser(res);
            this.router.navigate(['/login/options'], {
              state: { email: email, userExists: true },
            });

            return this.closeMenu();
          }

          this.router.navigate(['/register'], {
            state: { email: email, userExists: false },
          });
          this.closeMenu();
        },
      });

      return;
    }

    this.emailForm.markAllAsTouched();
    this.emailTouched.set(true);
  }

  protected closeMenu(): void {
    this.stateMenu = false;
  }

  protected logout(): void {
    this.loginState.setLoggedOut();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
