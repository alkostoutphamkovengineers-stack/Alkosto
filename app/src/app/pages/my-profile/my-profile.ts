import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginState } from '../../services/login-state';

@Component({
  selector: 'app-my-profile',
  imports: [RouterLink],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
})
export class MyProfile {
  constructor(protected readonly loginState: LoginState) {}
}
