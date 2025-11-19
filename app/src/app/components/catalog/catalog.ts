import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  protected menuOpen = false;
  protected selectedCategory: string = 'Celulares';

  constructor(private readonly router: Router) {}

  protected toggleMenu(event: Event): void {
    event.preventDefault();
    this.menuOpen = !this.menuOpen;
  }

  protected openMenu(): void {
    this.menuOpen = true;
  }

  protected closeMenu(): void {
    this.menuOpen = false;
  }

  protected selectCategory(name: string): void {
    this.selectedCategory = name;
  }

  protected redirectToCategory(categoryId: number) {
    const state = { categoryId, userExists: false };
    this.navigateToSearchWithState(state);
  }

  protected redirectToCategoryAndBrand(categoryId: number, brandId: number) {
    const state = { categoryId, brandId, userExists: false };
    this.navigateToSearchWithState(state);
  }

  private navigateToSearchWithState(state: any): void {
    if (this.router.url.startsWith('/search-view')) {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/search-view'], { state }))
        .finally(() => this.closeMenu());
    } else {
      this.router.navigate(['/search-view'], { state }).finally(() => this.closeMenu());
    }
  }
}
