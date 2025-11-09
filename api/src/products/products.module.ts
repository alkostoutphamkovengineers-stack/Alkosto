import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProducRepository } from './repository/product.repository';
import { ProductTypeOrm } from './repository/product.typeorm';
import { DataSource } from 'typeorm';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: ProducRepository,
      useFactory: (dataSource: DataSource) => new ProductTypeOrm(dataSource),
      inject: [DataSource],
    },
  ],
})
export class ProductsModule {}
