import { Routes } from '@angular/router';
import { OurStores } from './pages/our-stores/our-stores';
import { Home } from './pages/home/home';
import { LoginOptions } from './pages/login-options/login-options';
import { Register } from './pages/register/register';
import { EmailVerification } from './pages/email-verification/email-verification';
import { SearchView } from './pages/search-view/search-view';
import { HelpPage } from './pages/help-page/help-page';
import { MyProfile } from './pages/my-profile/my-profile';
import { UpdatePassword } from './pages/update-password/update-password';
import { Login } from './pages/login/login';
import { Catalog } from './pages/catalog/catalog';
import { DetailsView } from './pages/details-view/details-view';
import { ShoppingCart } from './pages/shopping-cart/shopping-cart';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'nuestra-compañia/tiendas',
    component: OurStores,
  },
  {
    path: 'login/options',
    component: LoginOptions,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'emailVerification',
    component: EmailVerification,
  },
  {
    path: 'help-page',
    component: HelpPage,
  },
  {
    path: 'my-account/update-profile',
    component: MyProfile,
  },
  {
    path: 'my-account/update-password',
    component: UpdatePassword,
  },
  {
    path: 'login/password',
    component: Login,
  },
  {
    path: 'search-view',
    component: SearchView,
  },
  {
    path: 'catalog',
    component: Catalog,
  },
  {
    path: 'details-view',
    component: DetailsView,
  },
  {
    path: 'shopping-cart',
    component: ShoppingCart,
  },
];
