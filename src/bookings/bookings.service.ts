import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MongoRepository, ObjectID } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class BookingsService {

    constructor(@InjectRepository(Booking) private bookingsRepository: MongoRepository<Booking>) { }

    async getAllBookings(): Promise<Booking[]> {
        return await this.bookingsRepository.find({
            relations: { user: true }
        });
    }

    async getBooking(id: string): Promise<Booking> {
        const convertedId: ObjectID = new ObjectId(id);
        const booking = await this.bookingsRepository.findOneBy({id: id});
        if (!booking) {
          throw new NotFoundException(`Booking with ID=${id} not found`);
        }
        return booking;
    }


    async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
        const booking = this.bookingsRepository.create(createBookingDto);
        return await this.bookingsRepository.save(booking);
    }

    async updateBooking(booking: Booking) {
        this.bookingsRepository.save(booking)
    }

    async deleteBooking(id: string): Promise<string[] | DeleteResult> {
        const booking: Booking = await this.bookingsRepository.findOneBy({id: id});
        const err: string[] = [];
        return this.bookingsRepository.delete(id);
    }
}