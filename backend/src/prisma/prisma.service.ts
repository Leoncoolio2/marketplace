/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      // Fail fast with a clear message
      throw new Error(
        'DATABASE_URL is not set. Please set DATABASE_URL in your environment or .env file (see .env.example)'
      );
    }

    const pool = new Pool({
      connectionString: databaseUrl,
    });

    const adapter: Prisma.PrismaClientOptions['adapter'] = new PrismaPg(pool);

    super({
      adapter,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Connected to the database via Prisma');
    } catch (err) {
      this.logger.error('Failed to connect to the database', err as any);
      throw err;
    }
  }
}
