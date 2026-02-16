import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description: string; price: number; sellerId: string; isPreorder?: boolean; availableAt?: Date }): Promise<Product> {
    // Ensure seller exists
    const seller = await this.prisma.user.findUnique({ where: { id: data.sellerId } });
    if (!seller) {
      throw new BadRequestException('Seller not found');
    }

    return this.prisma.product.create({ data });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({ include: { seller: true } });
  }

  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }
}
