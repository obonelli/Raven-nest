import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Global environment configuration
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting (100 requests per 60 seconds per IP)
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),

    // PostgreSQL connection
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT || 5432),
        database: process.env.PGDATABASE,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        autoLoadEntities: true,
        synchronize: true, // ⚠️ disable in production, use migrations instead
        ssl: { rejectUnauthorized: false },
      }),
    }),

    UsersModule,
    HealthModule,
    AuthModule,
  ],
  providers: [
    // Make ThrottlerGuard global
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule { }
