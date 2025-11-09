export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
  idCategoriaPadre: number | null;
  padre?: Categoria | null;
}

export interface Marca {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Producto {
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
  categoria: Categoria;
  idMarca: number;
  marca: Marca;
}

export interface CarritoProducto {
  id: number;
  id_carrito: number;
  producto: Producto;
  id_producto: number;
  amount: number;
}

export interface Carrito {
  id: number;
  id_usuario: number;
  activo: boolean;
  productos: CarritoProducto[];
}
