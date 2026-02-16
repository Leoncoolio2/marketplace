/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions>
  implements OnModuleInit
{
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL ?? '',
    });

    const adapter: Prisma.PrismaClientOptions['adapter'] = new PrismaPg(pool);

    super({
      adapter,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
