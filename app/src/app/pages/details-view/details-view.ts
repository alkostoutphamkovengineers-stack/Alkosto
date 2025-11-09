import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { Product } from '../../types/products';
import { BASEURL } from '../../core/http/url';
import { ShoppingCart as ShoppingCartService } from '../../services/shopping-cart';

@Component({
  selector: 'app-details-view',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './details-view.html',
  styleUrl: './details-view.scss',
})
export class DetailsView {
  protected productId: number = 0;

  refProductData = httpResource<Product>(() => {
    if (!this.productId) {
      return '';
    }
    return `${BASEURL}/products/product${this.productId}`;
  });

  productData = computed<Product | null>(() => this.refProductData.value() || null);

  constructor(private readonly router: Router, public readonly shoppingCart: ShoppingCartService) {
    const navigation = this.router.currentNavigation();
    if (navigation?.extras?.state) {
      this.productId = navigation.extras.state['productId'] ?? 0;
    }

    effect(() => {
      const thumbs = this.thumbnails();
      if (thumbs && thumbs.length > 0) {
        if (this.mainImage() !== thumbs[0]) this.mainImage.set(thumbs[0]);
      }
    });
  }

  protected mainImage = signal<string>('/img/cel_honorgran1.png');

  protected thumbnails = computed<string[]>(() => {
    const img = this.productData()?.imagen || '/img/cel_honorgran1.png';
    return [img, img, img, img, img, img];
  });

  protected selectedCapacity = signal('512 GB');
  protected selectedColor = signal('purpura');

  protected quantity = signal<number>(1);

  protected availableStock = computed<number>(() => this.productData()?.cantidad || 0);

  protected price = computed<number>((): number => {
    const data = this.productData();
    if (!data || !data.cantidad) {
      return 0;
    }
    const cantidad = this.quantity();
    if (!cantidad) {
      return data.precioBase;
    }

    return data.precioBase * cantidad;
  });

  protected selectImage(src: string) {
    this.mainImage.set(src);
  }

  protected prevImage() {
    const thumbs = this.thumbnails();
    const idx = thumbs.indexOf(this.mainImage());
    const nextIdx = idx <= 0 ? thumbs.length - 1 : idx - 1;
    this.mainImage.set(thumbs[nextIdx]);
  }

  protected nextImage() {
    const thumbs = this.thumbnails();
    const idx = thumbs.indexOf(this.mainImage());
    const nextIdx = idx === -1 || idx >= thumbs.length - 1 ? 0 : idx + 1;
    this.mainImage.set(thumbs[nextIdx]);
  }

  protected selectCapacity(cap: string) {
    this.selectedCapacity.set(cap);
  }

  protected selectColor(color: string) {
    this.selectedColor.set(color);
  }

  protected addToCart() {
    const item = this.productData();
    if (!item || !item.id) {
      return;
    }

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
