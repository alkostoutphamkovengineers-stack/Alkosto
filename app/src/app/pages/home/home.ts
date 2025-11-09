import { Component, computed, effect, WritableSignal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Products } from '../../services/products';
import { httpResource } from '@angular/common/http';
import { BASEURL } from '../../core/http/url';
import { Product } from '../../types/products';
import { Router } from '@angular/router';
import { ShoppingCart as ShoppingCartService } from '../../services/shopping-cart';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public readonly cartCount!: WritableSignal<number>;

  constructor(private readonly router: Router, public readonly shoppingCart: ShoppingCartService) {
    this.cartCount = this.shoppingCart.count;
  }

  refResource = httpResource<Product[]>(() => {
    return `${BASEURL}/products`;
  });

  productsData = computed<Product[]>(() => this.refResource.value() || []);

  protected viewDetail(productId: number) {
    this.router.navigate(['/details-view'], {
      state: { productId: productId, userExists: false },
    });
  }

  protected addProductToCard(item: Product) {
    this.shoppingCart.addProduct(Number(localStorage.getItem('id')), item.id, 1).subscribe({
      next: () => {
        this.shoppingCart.refreshCount(Number(localStorage.getItem('id')));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
