import { Component, HostListener, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { BASEURL } from '../../core/http/url';
import { Product } from '../../types/products';

@Component({
  selector: 'app-search',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  isOpen = false;
  suggestions: string[] = [
    'Celulares',
    'Televisores',
    'Portátiles',
    'Electrodomésticos',
    'Ofertas del día',
  ];
  popular: string[] = ['Celulares', 'Televisores', 'Portátiles'];

  @ViewChild('searchInput', { static: false }) searchInputRef!: ElementRef<HTMLInputElement>;

  protected searchQuery = signal('');
  protected refSearch = httpResource<Product[]>(() => {
    const q = this.searchQuery().trim();
    if (!q) return '';
    return `${BASEURL}/products/search?productName=${encodeURIComponent(q)}`;
  });

  protected productsSearch = computed<Product[]>(() => {
    return this.refSearch.value() || [];
  });
  protected topResults = computed<Product[]>(() => this.productsSearch().slice(0, 3));

  constructor(private readonly router: Router) {}

  onFocus() {
    this.isOpen = true;
  }

  selectSuggestion(s: string) {
    this.searchQuery.set(s);
    this.isOpen = false;
    if (this.searchInputRef && this.searchInputRef.nativeElement) {
      this.searchInputRef.nativeElement.value = s;
    }
  }

  selectPopular(p: string) {
    this.selectSuggestion(p);
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.performSearchRedirect();
    }
  }

  onSearchIcon() {
    this.performSearchRedirect();
  }

  protected performSearchRedirect() {
    const q = this.searchQuery().trim();

    // Navigate using queryParams so the URL changes and SearchView can react
    this.router.navigate(['/search-view'], {
      queryParams: { productName: q },
    });

    this.isOpen = false;
    // Clear the search field after redirect (clean UX)
    this.searchQuery.set('');
    if (this.searchInputRef && this.searchInputRef.nativeElement) {
      try {
        this.searchInputRef.nativeElement.value = '';
        this.searchInputRef.nativeElement.blur();
      } catch (err) {
        // ignore if native element not available
      }
    }
  }

  protected viewDetail(productId: number) {
    this.router.navigate(['/details-view'], {
      state: { productId: productId, userExists: false },
    });
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const form = document.querySelector('.search-form');
    if (!form) return;
    if (!form.contains(target)) {
      this.isOpen = false;
    }
  }
}
