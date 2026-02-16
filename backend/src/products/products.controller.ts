import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() body: { title: string; description: string; price: number; sellerId: string; isPreorder?: boolean; availableAt?: string }) {
    const payload = { ...body, availableAt: body.availableAt ? new Date(body.availableAt) : undefined };
    return this.productsService.create(payload as any);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
