import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT || 5432),
        database: process.env.PGDATABASE,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        autoLoadEntities: true,
        synchronize: true, // solo demo
        ssl: { rejectUnauthorized: false },
      }),
    }),
    UsersModule,
  ],
})
export class AppModule { }
