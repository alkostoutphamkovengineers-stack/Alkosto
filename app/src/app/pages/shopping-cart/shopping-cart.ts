import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ShoppingCart as ShoppingCartService } from '../../services/shopping-cart';
import { Carrito, CarritoProducto } from '../../types/cart';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart implements OnInit {
  protected cart = signal<Carrito>({} as Carrito);

  constructor(private router: Router, private readonly shoppingCart: ShoppingCartService) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.shoppingCart.findAllProductInCart(Number(localStorage.getItem('id'))).subscribe({
      next: (value: Carrito) => {
        this.cart.set(value);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  get productCount() {
    const prods = this.cart()?.productos ?? [];
    return prods.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0;
  }

  get subtotal() {
    const prods = this.cart()?.productos ?? [];
    return prods.reduce(
      (sum, p) => sum + (Number(p.producto.precioBase) || 0) * (p.amount || 0),
      0
    );
  }

  get discounts() {
    return 0;
  }

  get shipping() {
    return 0;
  }

  get total() {
    return this.subtotal - this.discounts + this.shipping;
  }

  changeQuantity(item: CarritoProducto, qty: number | string) {
    const q = typeof qty === 'string' ? parseInt(qty, 10) : qty;
    if (isNaN(q) || q < 1) return;

    const userId = Number(localStorage.getItem('id')) || 1;

    this.shoppingCart.updateProduct(userId, item.producto.id, q).subscribe({
      next: () => {
        this.getProduct();
        this.shoppingCart.refreshCount(userId);
      },
      error: (err) => {
        console.error('Failed changing quantity', err);
      },
    });
  }

  remove(item: CarritoProducto) {
    this.shoppingCart.deleteProduct(item.id).subscribe({
      next: () => {
        this.getProduct();
        this.shoppingCart.refreshCount(Number(localStorage.getItem('id')));
      },
    });
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}
