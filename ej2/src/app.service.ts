import { Injectable, NotFoundException } from '@nestjs/common';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

@Injectable()
export class AppService {
  private productos: Producto[] = [
    { id: 1, nombre: 'Laptop Gamer', precio: 1200, stock: 10 },
    { id: 2, nombre: 'Teclado Mecanico', precio: 80, stock: 25 },
    { id: 3, nombre: 'Mouse Inalámbrico', precio: 45, stock: 40 },
  ];

  findAll(): Producto[] {
    return this.productos;
  }

  findOne(id: number): Producto {
    const prod = this.productos.find((p) => p.id === id);
    if (!prod) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return prod;
  }

  create(data: { nombre: string; precio: number; stock: number }): Producto {
    const nuevoId = this.productos.length > 0 ? Math.max(...this.productos.map(p => p.id)) + 1 : 1;
    const nuevoProducto: Producto = {
      id: nuevoId,
      nombre: data.nombre,
      precio: data.precio,
      stock: data.stock,
    };
    this.productos.push(nuevoProducto);
    return nuevoProducto;
  }
}
