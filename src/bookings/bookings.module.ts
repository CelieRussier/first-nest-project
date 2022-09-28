import { Booking } from './booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}


