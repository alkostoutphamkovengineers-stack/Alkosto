import { Injectable } from '@nestjs/common';
import { ProducRepository } from './repository/product.repository';
import { FindProductsDto } from './dtos/find-products.dto';
import { FindSearchDto } from './dtos/find-search.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProducRepository) {}

  public async getAllProducts() {
    return await this.repository.getAllProducts({});
  }

  public async getAllProductsOrdered() {
    const products = await this.repository.getAllProducts({});
    if (!products) {
      return [];
    }

    const grouped = products.reduce(
      (acc, product) => {
        if (!product.categoria) return acc;

        const parentId =
          product.categoria.idCategoriaPadre ?? product.categoria.id;
        const parentName =
          product.categoria.padre?.nombre ?? product.categoria.nombre;

        if (!acc[parentId]) {
          acc[parentId] = {
            id: parentId,
            nombre: parentName,
            subcategorias: {},
          };
        }

        const categoryId = product.categoria.id;
        const categoryName = product.categoria.nombre;

        if (!acc[parentId].subcategorias[categoryId]) {
          acc[parentId].subcategorias[categoryId] = {
            id: categoryId,
            nombre: categoryName,
            marcas: {},
          };
        }

        const brandId = product.marca?.id ?? 'sin_marca';
        const brandName = product.marca?.nombre ?? 'Sin marca';

        if (!acc[parentId].subcategorias[categoryId].marcas[brandId]) {
          acc[parentId].subcategorias[categoryId].marcas[brandId] = {
            id: brandId,
            nombre: brandName,
            productos: [],
          };
        }

        acc[parentId].subcategorias[categoryId].marcas[brandId].productos.push(
          product,
        );

        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(grouped).map(parent => ({
      ...parent,
      subcategorias: Object.values(parent.subcategorias).map((sub: any) => ({
        ...sub,
        marcas: Object.values(sub.marcas),
      })),
    }));
  }

  public async getProductById(id: number) {
    return await this.repository.getProductById(id);
  }

  public async filteredProducts(filters: FindProductsDto) {
    const where: any = {};

    if (filters.nombre !== undefined) where.nombre = filters.nombre;
    if (filters.descripcion !== undefined)
      where.descripcion = filters.descripcion;
    if (filters.precioBase !== undefined) where.precioBase = filters.precioBase;
    if (filters.codigo !== undefined) where.codigo = filters.codigo;
    if (filters.disponibilidad !== undefined)
      where.disponibilidad = filters.disponibilidad;
    if (filters.idCategoria !== undefined)
      where.categoria = { id: filters.idCategoria };
    if (filters.idMarca !== undefined) where.marca = { id: filters.idMarca };

    const products = await this.repository.getAllProducts({
      where,
    });

    return products;
  }

  public async searchProduct(productName: string) {
    return await this.repository.searchProducts(productName);
  }

  public async getBrand() {
    return await this.repository.getAllBrands({});
  }

  public async getCategories() {
    return await this.repository.getAllCategories({});
  }

  public async getFiltersSpecial(where: FindSearchDto) {
    const minPrice = where.minPrice ?? 0;
    const maxPrice = where.maxPrice ?? Number.MAX_SAFE_INTEGER;

    const brandParam =
      where.idMarca === undefined
        ? undefined
        : Array.isArray(where.idMarca)
          ? where.idMarca
          : [where.idMarca];

    return await this.repository.getProtuctsByFilters(
      brandParam,
      [minPrice, maxPrice],
      where.disponibilidad,
    );
  }
}
