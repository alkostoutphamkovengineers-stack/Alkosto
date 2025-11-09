import { DeleteResult, UpdateResult } from 'typeorm';
import { CartProductEntity } from '../entities/cart-products.entity';
import { CartEntity } from '../entities/cart.entity';

export abstract class ShoppingCartRepository {
  abstract getShoppingCart(userId: number): Promise<CartEntity | null>;
  abstract newShoppingCart(userId: number): Promise<CartEntity>;
  abstract countProductsInCart(userId: number): Promise<number>;
  abstract newProductInCart(
    cartId: number,
    productId: number,
    amount: number,
  ): Promise<CartProductEntity>;
  abstract changeAmountProductCart(
    cartProductId: number,
    amount: number,
  ): Promise<UpdateResult>;
  abstract deleteProductInCar(
    cartProductId: number,
  ): Promise<DeleteResult>;
}
