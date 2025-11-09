import { Injectable } from '@nestjs/common';
import { ShoppingCartRepository } from './repository/shopping-cart.repository';

@Injectable()
export class ShoppingCartService {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
  ) {}

  public async getShoppingCart(userId: number) {
    return await this.shoppingCartRepository.getShoppingCart(userId);
  }

  public async countProductsInCart(userId: number) {
    return await this.shoppingCartRepository.countProductsInCart(userId);
  }

  public async changeAmountProductCart(
    userId: number,
    productId: number,
    amount: number,
  ) {
    const shoppingCart =
      await this.shoppingCartRepository.getShoppingCart(userId);
    if (!shoppingCart) {
      throw new Error();
    }

    const product = shoppingCart.productos.find(
      value => value.id_producto === productId,
    );
    if (!product) {
      throw new Error();
    }

    if (amount === 0) {
      return await this.shoppingCartRepository.deleteProductInCar(product.id);
    }

    return await this.shoppingCartRepository.changeAmountProductCart(
      product.id,
      amount,
    );
  }

  public async addProductToCart(
    userId: number,
    productId: number,
    amount: number,
  ) {
    let shoppingCart =
      await this.shoppingCartRepository.getShoppingCart(userId);
    if (!shoppingCart) {
      shoppingCart = await this.shoppingCartRepository.newShoppingCart(userId);
      return await this.shoppingCartRepository.newProductInCart(
        shoppingCart.id,
        productId,
        amount,
      );
    }

    const product = shoppingCart.productos.find(
      value => value.id_producto === productId,
    );
    if (!product) {
      return await this.shoppingCartRepository.newProductInCart(
        shoppingCart.id,
        productId,
        amount,
      );
    }

    const newAmoun = amount + product.amount;
    return await this.shoppingCartRepository.changeAmountProductCart(
      product.id,
      newAmoun,
    );
  }

  public async deleteProduct(id: number) {
    return await this.shoppingCartRepository.deleteProductInCar(id);
  }
}
