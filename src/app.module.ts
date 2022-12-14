// src/app/app.module.ts

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { LoggerMiddleware } from './logger.middleware';
import { ApiModule } from './api/api.module';
import { HttpModule } from '@nestjs/axios';

const dbConfigFile = join(__dirname, '../ormconfig.json')

@Module({
  imports: [TypeOrmModule.forRoot(require(dbConfigFile)), UsersModule, BookingsModule, ApiModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
    .forRoutes('*')
  }
}