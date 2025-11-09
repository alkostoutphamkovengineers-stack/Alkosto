import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { UserIdDto } from './dtos/user-id.dto';
import { ShopProductDto } from './dtos/shop-product.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly service: ShoppingCartService) {}

  @Get()
  public async getShoppingCart(@Query() query: UserIdDto) {
    return await this.service.getShoppingCart(query.userId);
  }

  @Get('count')
  public async countProductsInCart(@Query() query: UserIdDto) {
    return await this.service.countProductsInCart(query.userId);
  }

  @Post('product')
  public async addProductToCart(@Body() body: ShopProductDto) {
    return await this.service.addProductToCart(
      body.userId,
      body.productId,
      body.amount,
    );
  }

  @Patch('product')
  public async changeAmountProductCart(@Body() body: ShopProductDto) {
    return await this.service.changeAmountProductCart(
      body.userId,
      body.productId,
      body.amount,
    );
  }

  @Delete(':id')
  public async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.service.deleteProduct(id);
  }
}
