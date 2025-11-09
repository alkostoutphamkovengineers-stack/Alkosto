import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import { BASEURL } from '../../core/http/url';
import { GrupoProductos } from '../../types/products.group';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  constructor(private readonly router: Router) {}

  refProductsGorup = httpResource<GrupoProductos[]>(() => {
    return `${BASEURL}/products/ordered`;
  });

  productsGrop = computed<GrupoProductos[]>(() => this.refProductsGorup.value() || []);

  scrollToSubcategory(event: Event, subIndex: number) {
    try {
      const li = (event.currentTarget || event.target) as HTMLElement;
      const section = li.closest('.category-section') as HTMLElement | null;
      if (!section) return;
      const targetId = `sub-${subIndex}`;
      const target = section.querySelector(`#${targetId}`) as HTMLElement | null;
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    } catch (err) {
      console.warn('scrollToSubcategory error', err);
    }
  }

  protected viewDetail(productId: number) {
    this.router.navigate(['/details-view'], {
      state: { productId: productId, userExists: false },
    });
  }
}
