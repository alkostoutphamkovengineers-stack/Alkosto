export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: number;
  cantidad: number;
  codigo: string;
  imagen: string;
  disponibilidad: boolean;
  activo: boolean;
  idCategoria: number;
  categoria: Category;
  idMarca: number;
  marca: Brand;
}

export interface Category {
  id: number;
  nombre: string;
  activo: boolean;
  idCategoriaPadre: number | null;
  padre?: Category;
}

export interface Brand {
  id: number;
  nombre: string;
  activo: boolean;
}
