import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { FindCursor, InsertOneResult, WithId } from 'mongodb';
import { Booking } from './booking.entity'; 
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
    @Inject()
    bookingsService: BookingsService;

    @Post()
    async create(@Body() createBookingDto: Booking): Promise<InsertOneResult<Booking>> {
        return await this.bookingsService.create(createBookingDto);
    }

    @Get('/user/:id/travelled-booking/')
    async getTravelledBooking(@Param('id') id: string): Promise<Booking[]> {
        return await this.bookingsService.findUserTravelledBookings(id);
    }

    @Get('/user/:id/scheduled-booking/')
    async getScheduledBooking(@Param('id') id: string): Promise<Booking[]> {
        return await this.bookingsService.findUserScheduledBookings(id);
    }

    @Get('/user/:id')
    async getBookingsByUserId(@Param('id') id: string): Promise<Booking[]> {
        return await this.bookingsService.findUserBookings(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Booking> {
        return await this.bookingsService.findOne(id);
    }

    @Get()
    async findAll(): Promise<Booking[]> {
        return await this.bookingsService.findAll();
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<void> {
        return await this.bookingsService.update(id, updateBookingDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<string[] | void>  {
        return await this.bookingsService.delete(id);
    }
    
}
