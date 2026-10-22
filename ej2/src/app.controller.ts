import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AppService, Producto } from './app.service';

@Controller('productos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getProductos(): Producto[] {
    return this.appService.findAll();
  }

  @Get(':id')
  getProductoPorId(@Param('id', ParseIntPipe) id: number): Producto {
    return this.appService.findOne(id);
  }

  @Post()
  crearProducto(@Body() body: { nombre: string; precio: number; stock: number }): Producto {
    return this.appService.create(body);
  }
}
