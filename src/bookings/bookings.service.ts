import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import { DeleteResult, MongoRepository, ObjectID } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Db, ObjectID } from 'mongodb';

@Injectable()
export class BookingsService {

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
      ) {}

    async getAllBookings(): Promise<Booking[]> {
        return await this.db.collection('bookings').find({
            relations: { user: true }
        });
    }

    async getBooking(id: string): Promise<Booking> {
        const convertedId: ObjectID = new ObjectID(id);
        const booking = await this.db.collection('bookings').findOneBy({id: id});
        if (!booking) {
          throw new NotFoundException(`Booking with ID=${id} not found`);
        }
        return booking;
    }


    async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
        const booking = this.db.collection('bookings').create(createBookingDto);
        return await this.db.collection('bookings').save(booking);
    }

    async updateBooking(booking: Booking) {
        this.db.collection('bookings').save(booking)
    }

    async deleteBooking(id: string): Promise<string[] | void> {
        const booking: Booking = await this.db.collection('bookings').findOneBy({id: id});
        const err: string[] = [];
        return this.db.collection('bookings').delete(id);
    }
}