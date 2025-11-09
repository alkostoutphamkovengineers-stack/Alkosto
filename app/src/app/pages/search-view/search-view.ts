import { Component, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { BASEURL } from '../../core/http/url';
import { Brand } from '../../types/brands';
import { Product } from '../../types/products';
import { ShoppingCart as ShoppingCartService } from '../../services/shopping-cart';

@Component({
  selector: 'app-search-view',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './search-view.html',
  styleUrl: './search-view.scss',
})
export class SearchView {
  protected brandQuery: string = '';

  protected refBrands = httpResource<Brand[]>(() => {
    return `${BASEURL}/products/brands`;
  });
  protected brands = computed<string[]>(
    () => this.refBrands.value()?.map((res) => res.nombre) || []
  );

  // use a signal for selected brand ids so httpResource re-evaluates when selection changes
  protected selectedBrands = signal<number[]>([]);
  protected brandsCount: Record<string, number> = {
    APPLE: 137,
    ARGOM: 2,
    BACKBONE: 2,
    BELKIN: 1,
    DJI: 2,
    HONOR: 29,
    HUAWEI: 16,
    I2GO: 5,
    INFINIX: 11,
    KALLEY: 12,
  };

  protected visibleCount = 25;
  protected totalCount = 581;
  protected query: string = 'celulares';
  protected sortBy: string = 'relevance';

  protected categoryFinded: number = 0;
  protected brandFinded: number = 0;
  protected productName = signal('');

  // additional filters
  protected disponibilidad = signal<boolean>(false);
  // price range key like '0-500000', '500001-1000000', '5000001-inf'
  protected selectedPriceRange = signal<string>('');

  // computed list of brands (objects) from refBrands
  protected brandsList = computed<Brand[]>(() => this.refBrands.value() || []);

  refProductsFilter = httpResource<Product[]>(() => {
    // if there are additional filters (disponibilidad, selectedBrands, price range), call filters-additionals
    const disponibilidad = this.disponibilidad();
    const brands = this.selectedBrands();
    const priceRangeKey = this.selectedPriceRange();

    // build params for filters-additionals when any additional filter exists
    if (disponibilidad || (brands && brands.length > 0) || priceRangeKey) {
      const params: string[] = [];
      if (disponibilidad) params.push(`disponibilidad=true`);
      // add brand ids
      if (brands && brands.length > 0) {
        for (const id of brands) params.push(`idMarca=${id}`);
      }

      // parse priceRangeKey to min/max
      if (priceRangeKey) {
        const parts = priceRangeKey.split('-');
        const min = parts[0] === '0' ? 0 : parseInt(parts[0], 10);
        const max = parts[1] && parts[1] !== 'inf' ? parseInt(parts[1], 10) : undefined;
        if (!isNaN(min)) params.push(`minPrice=${min}`);
        if (max !== undefined && !isNaN(max)) params.push(`maxPrice=${max}`);
      }

      // if productName present also include it
      if (this.productName()) params.push(`productName=${encodeURIComponent(this.productName())}`);

      const query = params.join('&');
      return `${BASEURL}/products/filters-additionals?${query}`;
    }

    // fallback: if a productName is present, use the search endpoint
    if (this.productName()) {
      return `${BASEURL}/products/search?productName=${encodeURIComponent(this.productName())}`;
    }

    // fallback to filtered by category/brand (original behavior)
    let extraParams: string = '';
    let count: number = 0;

    if (this.categoryFinded) {
      extraParams = extraParams.concat(`?idCategoria=${this.categoryFinded}`);
      count++;
    }

    if (this.brandFinded) {
      extraParams =
        count === 0
          ? extraParams.concat(`?idMarca=${this.brandFinded}`)
          : extraParams.concat(`&idMarca=${this.brandFinded}`);
      count++;
    }

    return `${BASEURL}/products/filtered${extraParams}`;
  });

  productsFilter = computed<Product[]>(() => {
    const data = this.refProductsFilter.value() || [];
    return data;
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly shoppingCart: ShoppingCartService
  ) {
    const navigation = this.router.currentNavigation();
    if (navigation?.extras?.state) {
      this.categoryFinded = navigation.extras.state['categoryId'] ?? 0;
      this.brandFinded = navigation.extras.state['brandId'] ?? 0;
      const pn = navigation.extras.state['productName'] ?? '';
      if (pn) this.productName.set(pn);
    }

    // subscribe to query params so this view reacts when /search-view?productName=... is navigated to
    this.route.queryParams.subscribe((params) => {
      const q = (params['productName'] as string) || '';
      this.productName.set(q);
    });
  }

  protected filteredBrands(): Brand[] {
    const q = this.brandQuery.trim().toLowerCase();
    const list = this.brandsList();
    if (!q) return list;
    return list.filter((b) => b.nombre.toLowerCase().includes(q));
  }

  protected toggleBrand(brandId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.selectedBrands();
    if (checked) {
      if (!current.includes(brandId)) this.selectedBrands.set([...current, brandId]);
    } else {
      this.selectedBrands.set(current.filter((x) => x !== brandId));
    }
    // httpResource will pick up the change because selectedBrands is a signal
  }

  protected isBrandSelected(id: number) {
    return this.selectedBrands().includes(id);
  }

  protected toggleDisponibilidad(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.disponibilidad.set(checked);
  }

  protected selectPriceRange(rangeKey: string) {
    this.selectedPriceRange.set(rangeKey);
  }

  protected viewDetail(productId: number) {
    this.router.navigate(['/details-view'], {
      state: { productId: productId, userExists: false },
    });
  }

  protected addToCart(item: Product) {
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
