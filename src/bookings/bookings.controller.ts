import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './booking.entity';
import { DeleteResult } from 'typeorm';

@Controller('bookings')
export class BookingsController {
    @Inject()
    bookingsService: BookingsService;

    @Post()
    create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
        return this.bookingsService.createBooking(createBookingDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Booking> {
        return await this.bookingsService.getBooking(id);
    }

    @Get()
    async findAll(): Promise<Booking[]> {
        return await this.bookingsService.getAllBookings();
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<string[] | void>  {
        return await this.bookingsService.deleteBooking(id);
    }
    
}
