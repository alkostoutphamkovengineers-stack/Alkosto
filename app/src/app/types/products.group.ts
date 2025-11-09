export interface Marca {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface CategoriaPadre {
  id: number;
  nombre: string;
  activo: boolean;
  idCategoriaPadre: null;
}

export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
  idCategoriaPadre: number;
  padre: CategoriaPadre;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: string;
  cantidad: number;
  codigo: string;
  imagen: string;
  disponibilidad: boolean;
  activo: boolean;
  idCategoria: number;
  categoria: Categoria;
  idMarca: number;
  marca: Marca;
}

export interface MarcaGrupo {
  id: number;
  nombre: string;
  productos: Producto[];
}

export interface Subcategoria {
  id: number;
  nombre: string;
  marcas: MarcaGrupo[];
}

export interface GrupoProductos {
  id: number;
  nombre: string;
  subcategorias: Subcategoria[];
}
