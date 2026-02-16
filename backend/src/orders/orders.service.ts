import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { buyerId: string; productId: string; quantity: number; }): Promise<Order> {
    if (data.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const product = await this.prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.sellerId === data.buyerId) {
      throw new BadRequestException('Seller cannot buy own product');
    }

    const total = product.price * data.quantity;

    return this.prisma.order.create({ data: { buyerId: data.buyerId, productId: data.productId, quantity: data.quantity, total } });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({ include: { product: true, buyer: true } });
  }

  async findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { id }, include: { product: true, buyer: true } });
  }
}
