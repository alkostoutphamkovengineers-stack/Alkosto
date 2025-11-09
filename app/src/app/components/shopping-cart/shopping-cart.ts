import { Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShoppingCart as ShoppingCartService } from '../../services/shopping-cart';

@Component({
  selector: 'app-shopping-cart',
  imports: [RouterLink],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart implements OnInit {
  public count!: WritableSignal<number>;

  constructor(private readonly shoppingCart: ShoppingCartService) {
    this.count = this.shoppingCart.count;
  }

  ngOnInit(): void {
    this.shoppingCart.refreshCount(Number(localStorage.getItem('id')));
  }

  public refreshCount(): void {
    this.shoppingCart.refreshCount(Number(localStorage.getItem('id')));
  }

  public notifyProductAdded(): void {
    this.refreshCount();
  }
}
