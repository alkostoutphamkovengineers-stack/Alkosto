import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalog } from '../catalog/catalog';
import { MyAccount } from '../my-account/my-account';
import { ShoppingCart } from '../shopping-cart/shopping-cart';
import { Search } from '../search/search';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    Search,
    Catalog,
    MyAccount,
    ShoppingCart,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
