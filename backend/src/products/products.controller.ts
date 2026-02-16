import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() body: CreateProductDto) {
    const payload = {
      title: body.title,
      description: body.description,
      price: body.price,
      sellerId: body.sellerId,
      isPreorder: body.isPreorder ?? true,
      availableAt: body.availableAt ? new Date(body.availableAt) : undefined,
    };
    return this.productsService.create(payload);
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
