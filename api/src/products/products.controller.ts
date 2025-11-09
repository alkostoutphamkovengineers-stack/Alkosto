import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SearchProductDto } from './dtos/search.products.dto';
import { FindProductsDto } from './dtos/find-products.dto';
import { FindSearchDto } from './dtos/find-search.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get('')
  public async getAllProducts() {
    return await this.service.getAllProducts();
  }

  @Get('/product:id')
  public async getProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getProductById(id);
  }

  @Get('ordered')
  public async getAllProductsOrdered() {
    return await this.service.getAllProductsOrdered();
  }

  @Get('filtered')
  public async getFilterProducts(@Query() query: FindProductsDto) {
    return await this.service.filteredProducts(query);
  }

  @Get('search')
  public async searchProducts(@Query() query: SearchProductDto) {
    return await this.service.searchProduct(query.productName);
  }

  @Get('categories')
  public async getAllCategories() {
    return await this.service.getCategories();
  }

  @Get('brands')
  public async getAllBrands() {
    return await this.service.getBrand();
  }

  @Get('filters-additionals')
  public async getFiltersAditionals(@Query() query: FindSearchDto) {
    return await this.service.getFiltersSpecial(query);
  }
}
