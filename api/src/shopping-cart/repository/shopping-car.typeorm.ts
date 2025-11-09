import { DataSource, QueryRunner, DeleteResult, UpdateResult } from 'typeorm';
import { CartProductEntity } from '../entities/cart-products.entity';
import { CartEntity } from '../entities/cart.entity';
import { ShoppingCartRepository } from './shopping-cart.repository';

export class ShoppingCartTypeOrm implements ShoppingCartRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getShoppingCart(userId: number): Promise<CartEntity | null> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        const data = await queryRunner.manager.find(CartEntity, {
          where: {
            usuario: { id: userId },
          },
          relations: {
            productos: {
              producto: {
                categoria: {
                  padre: true,
                },
                marca: true,
              },
            },
          },
        });
        return data ? data[0] : data;
      });
    } catch (error) {
      return null;
    }
  }

  public async newShoppingCart(userId: number): Promise<CartEntity> {
    const entity = {
      usuario: { id: userId },
    };
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        return await queryRunner.manager.save(CartEntity, entity);
      });
    } catch (error) {
      throw error;
    }
  }

  public async countProductsInCart(userId: number): Promise<number> {
    try {
      return await this.performTransaction<number>(
        async (queryRunner: QueryRunner) => {
          const data = await queryRunner.manager.find(CartEntity, {
            where: {
              usuario: { id: userId },
            },
            relations: {
              productos: {
                producto: {
                  categoria: {
                    padre: true,
                  },
                  marca: true,
                },
              },
            },
          });

          if (data.length === 0) return 0;
          const cart = data[0];
          return (cart.productos ?? []).reduce(
            (sum, p) => sum + (p.amount ?? 0),
            0,
          );
        },
      );
    } catch (error) {
      return 0;
    }
  }

  public async newProductInCart(
    cartId: number,
    productId: number,
    amount: number,
  ): Promise<CartProductEntity> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        const entity = {
          carrito: { id: cartId },
          producto: { id: productId },
          amount: amount,
        };
        return await queryRunner.manager.save(CartProductEntity, entity);
      });
    } catch (error) {
      throw error;
    }
  }

  public async changeAmountProductCart(
    cartProductId: number,
    amount: number,
  ): Promise<UpdateResult> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        const entity = {
          amount: amount,
        };
        return await queryRunner.manager.update(
          CartProductEntity,
          cartProductId,
          entity,
        );
      });
    } catch (error) {
      throw error;
    }
  }

  public async deleteProductInCar(
    cartProductId: number,
  ): Promise<DeleteResult> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        return await queryRunner.manager.delete(
          CartProductEntity,
          cartProductId,
        );
      });
    } catch (error) {
      throw error;
    }
  }

  private async performTransaction<T>(
    work: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
