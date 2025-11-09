import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartRepository } from './repository/shopping-cart.repository';
import { DataSource } from 'typeorm';
import { ShoppingCartTypeOrm } from './repository/shopping-car.typeorm';

@Module({
  controllers: [ShoppingCartController],
  providers: [
    ShoppingCartService,
    {
      provide: ShoppingCartRepository,
      useFactory: (dataSource: DataSource) =>
        new ShoppingCartTypeOrm(dataSource),
      inject: [DataSource],
    },
  ],
})
export class ShoppingCartModule {}
